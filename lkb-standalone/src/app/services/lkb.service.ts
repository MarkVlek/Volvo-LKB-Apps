import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, combineLatest, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { LkbCategory, VolvoLeveransklarabilar } from '../pages/leveransklarabilar/models/LkbCategory';
import { HarmonyConfigService } from './harmony-config.service';
import { AnalyticsService } from './analytics.service';
import * as dealerIds from '../../assets/js/Volvo_Wayke_Dealer_IDs.json';

@Injectable({ providedIn: 'root' })
export class LkbService {

  // ── State ────────────────────────────────────────────────────────────────
  allBrandsAvailable: boolean = false;
  carLocationsCount: any;
  selectedCar: any;
  startCategory: any;
  filteredCars: BehaviorSubject<VolvoLeveransklarabilar[]> = new BehaviorSubject<VolvoLeveransklarabilar[]>([]);
  currentSelected$: Subject<LkbCategory> = new Subject();
  toggleDrawer$: Subject<void> = new Subject();
  showInsurance = false;
  allCars: VolvoLeveransklarabilar[] = [];
  unfilteredCars: VolvoLeveransklarabilar[] = [];
  sideBar: boolean = true;
  currentPaginationPage: any;
  paginationAllLoaded: any;
  searchableBranchNames: string;
  displayedCars: VolvoLeveransklarabilar[] = [];

  /**
   * Turns true once the startup inventory load has finished, whether it found anything or not.
   * Lets a view tell "still loading" apart from "there is nothing to show".
   */
  inventoryLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /** Values supplied by the player (device), which outrank the template's own settings. */
  deviceBranchNames: string = '';
  deviceDealerId: string = '';

  /** Which setting the inventory actually came from — reported with the startup Health event. */
  private resolvedSource: string = 'none';

  /**
   * Upper bound for a single inventory request. One organisation can hold ~1000 vehicles and the
   * API truncates silently at whatever `hits` says, so this sits well above the largest dealer.
   */
  private static readonly SEARCH_HITS = 2000;

  constructor(
    private http: HttpClient,
    private harmonyConfig: HarmonyConfigService,
    private analytics: AnalyticsService
  ) { }

  // ── Category definitions (static, no backend needed) ─────────────────────
  getCategoryTypes() {
    return [
      new LkbCategory(
        'Nya bilar', 'Nya bilar', 'Nästan ny Volvo', 'Category',
        'assets/images/AppSpecific/LeveransKlaraBilar/LKB_nya.png',
        'assets/images/AppSpecific/LeveransKlaraBilar/LKB_nya.png',
        'Utforska vårt utbud av nya bilar i lager'
      ),
      new LkbCategory(
        'Volvo Selekt', 'Selekt', 'Nästan ny Volvo', 'Category',
        'assets/images/AppSpecific/LeveransKlaraBilar/LKB_selekt.png',
        'assets/images/AppSpecific/LeveransKlaraBilar/LKB_selekt.png',
        'Utforska våra certifierade begagnade bilar'
      ),
      new LkbCategory(
        'Alla bilar', 'Alla Volvo', '', 'Category',
        'assets/images/AppSpecific/LeveransKlaraBilar/LKB_alla.png',
        'assets/images/AppSpecific/LeveransKlaraBilar/LKB_alla.png',
        'Utforska alla bilar i lager'
      )
    ];
  }

  // ── Inventory API ─────────────────────────────────────────────────────────
  /**
   * Fetches the full vehicle inventory from the Wayke/cloud API endpoint
   * configured in the Harmony template parameters (InventoryApiUrl).
   */
  // getAPIKeys(): string[] {
  //   let keys = [];
  //   let branches = this.searchableBranchNames.split(',');
  //   for (let id in dealerIds) {
  //     branches.forEach(el => {
  //       if (dealerIds[id]["Organization Name"] == el.trim()) {
  //         keys.push(dealerIds[id]["Organization ID"])
  //       }
  //     });
  //   };
  //   return keys;
  // };

  /** Splits a comma-separated setting into trimmed, non-empty values. */
  private splitList(value: any): string[] {
    return String(value ?? '').split(',').map(v => v.trim()).filter(v => v.length > 0);
  }

  /**
   * A branch name reaches us in one of two shapes and both have to work: an operator types
   * `Bilia Jägersro Volvo` into Harmony by hand, while the player stores that same name already
   * percent-encoded, as `Bilia J%C3%A4gersro Volvo`.
   *
   * Encoding the encoded shape turns its `%` into `%25`, so the API searches for the literal text
   * "Bilia J%C3%A4gersro Volvo" and matches nothing. A `%` is the tell — no Wayke branch name
   * contains one — so a value carrying it is left as it is.
   *
   * Its spaces are still encoded: the player encodes the letters but not the spaces, and a URL
   * carrying a raw space is only accepted because browsers quietly repair it.
   */
  private encodeName(value: string): string {
    return value.includes('%')
      ? value.replace(/ /g, '%20')
      : encodeURIComponent(value);
  }

  /**
   * One inventory request. The API accepts a parameter repeated per value, so every branch or
   * dealer is covered by a single call rather than one call each.
   *
   * `param` is 'branch' (names), 'branchId' (a single showroom) or 'parentId' (a whole dealer
   * organisation, i.e. all of its showrooms). Only names need the encoding check above; an ID is a
   * GUID either way.
   */
  private searchBy(param: string, values: string[]): Observable<VolvoLeveransklarabilar[]> {
    const encode = param === 'branch'
      ? (v: string) => this.encodeName(v)
      : (v: string) => encodeURIComponent(v);

    const query = values.map(v => `${param}=${encode(v)}`).join('&');
    const url = `${this.harmonyConfig.inventoryApiUrl}/vehicles?hits=${LkbService.SEARCH_HITS}&${query}`;

    return this.http.get(url, {
      headers: { 'x-api-key': this.harmonyConfig.waykeApiToken }
    }).pipe(map(data => this.formatCars([data])));
  }

  /**
   * The one setting the inventory is read from, in priority order: device (player) settings
   * outrank the template's own, and an ID outranks a name at each level. Only the
   * highest-priority configured setting is used — see getAllCars() for why.
   */
  private searchSource(): { kind: 'id' | 'name', values: string[], label: string } | null {
    const candidates: [('id' | 'name'), any, string][] = [
      ['id', this.deviceDealerId, 'device dealer ID'],
      ['name', this.deviceBranchNames, 'device branch names'],
      ['id', this.harmonyConfig.dealerId, 'template dealer ID'],
      ['name', this.searchableBranchNames, 'template branch names'],
    ];

    for (const [kind, raw, label] of candidates) {
      const values = this.splitList(raw);
      if (values.length) return { kind, values, label };
    }

    return null;
  }

  /**
   * Vehicles for the configured dealer, or none at all.
   *
   * Showing one dealership's stock on another dealership's screen is not permitted, so nothing
   * here may widen the search: an unconfigured screen shows no cars, and a configured screen that
   * comes back empty stays empty rather than falling back to a lower-priority setting that could
   * belong to a different dealer.
   *
   * The one retry that is safe stays in place. A Wayke ID can identify either a single showroom
   * (`branchId`) or a whole dealer organisation (`parentId`) and nothing in the value itself says
   * which, so an ID is tried both ways — both forms name the same dealer.
   */
  getAllCars(): Observable<VolvoLeveransklarabilar[]> {
    const source = this.searchSource();

    if (!source) {
      this.analytics.track(false, 'Health', 'No inventory source configured — showing no cars');
      return of([]);
    }

    this.resolvedSource = source.label;

    return source.kind === 'name'
      ? this.searchBy('branch', source.values)
      : this.searchBy('branchId', source.values).pipe(
        switchMap(cars => cars.length ? of(cars) : this.searchBy('parentId', source.values)));
  }

  formatCars(response): VolvoLeveransklarabilar[] {
    let carArray = new Array<VolvoLeveransklarabilar>;
    for (let id in response) {
      let array = response[id].documentList.documents;
      for (let id in array) {
        let retCar = this.formatCar(array[id]);
        carArray.push(retCar);
      };
    }

    return carArray;
  }

  formatCar(carData: any): VolvoLeveransklarabilar {
    let singleCar = false;
    if (carData.documentList?.documents[0]) {
      singleCar = true;
      carData = carData.documentList.documents[0];
    };

    let retCar = {
      isSelekt: false,
      medias: []
    };

    // isSelekt
    // if (carData.hasManufacturerPackaging == true && carData.resellerPackagingOptions?.[0]?.title?.includes('Selekt')) {
    //   retCar.isSelekt = true;
    // }

    // hasManufacturerPackaging is the certified-programme flag, which for Volvo means Selekt.
    // It used to also require a Selekt marker in resellerPackagingOptions, but that array holds
    // optional marketing copy the dealer attaches by hand — most never do, so whole sites showed
    // one Selekt car instead of dozens. shortDescription never contains "SELEKT" at all.
    // The manufacturer guard is belt-and-braces: no non-Volvo vehicle in the feed carries the flag.
    retCar.isSelekt = carData.hasManufacturerPackaging === true &&
      (carData.manufacturer || '').toUpperCase() === 'VOLVO'


    // Thumb File
    if (singleCar === false) {
      let thumbImg = carData.featuredImage?.files?.[0]?.formats;
      let selectedThumbFile = { format: '0', url: '', id: '' };

      for (let j in thumbImg) {
        if (parseInt(thumbImg[j].format) > parseInt(selectedThumbFile.format) && parseInt(thumbImg[j].format) < 770) {
          selectedThumbFile = thumbImg[j];
        };
      };

      if (selectedThumbFile.url) {
        let thumbFile = {
          name: 'thumb_' + selectedThumbFile.id,
          url: selectedThumbFile.url,
          sortOrder: 0
        };
        retCar.medias.push(thumbFile);
      };
    };

    // Media Files
    for (let i in carData.media) {
      let mediaFiles = carData.media?.[i].files?.[0]?.formats;
      let sorderOrder = carData.media?.[i].sortOrder;
      let selectedMediaFile = { format: '0', url: '', id: '' };

      for (let j in mediaFiles) {
        if (parseInt(mediaFiles[j].format) > parseInt(selectedMediaFile.format)) {
          selectedMediaFile = mediaFiles[j];
        };
      };

      if (selectedMediaFile.url) {
        let mediaFile = {
          name: selectedMediaFile.id,
          url: selectedMediaFile.url,
          sortOrder: sorderOrder
        };
        retCar.medias.push(mediaFile);
      };
    };

    let returnCar = new VolvoLeveransklarabilar(
      carData._id,
      carData._id,
      carData.branches?.[0]?.id,
      carData.branches?.[0]?.name,
      carData.branches?.[0]?.name,
      carData.position?.city,
      carData.registrationNumber || "",
      carData.manufacturer,
      carData.manufactureYear,
      carData.title,
      carData.modelSeries,
      carData.modelYear,
      carData.shortDescription,
      carData.mileage,
      carData.price,
      carData.gearboxType,
      carData.fuelTypes,
      carData.properties?.colorName || "",
      carData.properties?.chassis,
      carData.enginePower,
      retCar.isSelekt,
      carData.itemUpdated,
      carData.financialOptions?.[0]?.interest,
      carData.financialOptions?.[0]?.effectiveInterestRate,
      retCar.medias,
      carData.options || [],
      carData.position?.street,
      carData.position?.zip,
      carData.properties?.drivingWheel,
      carData.properties?.fuelConsumptionMixedDrivingWLTP
    );

    return returnCar;
  };

  /**
   * Fetches a single vehicle by registration number for the detail page.
   * Uses the same base URL with the regNr appended.
   */
  getCar(regNr: string): Observable<VolvoLeveransklarabilar> {
    const url = `${this.harmonyConfig.inventoryApiUrl}/vehicle?id=${regNr}`;

    return this.http.get(url, {
      headers: { 'x-api-key': this.harmonyConfig.waykeApiToken }
    }).pipe(
      map(data => Object.assign(this.formatCar(data)))
    );
  }

  initializeCars() {
    const loader = (window as any).Loader;
    if (loader) {
      loader.getPlayerParameters(["BRANCH_NAMES", "DEALER_ID"]).then(values => {
        // Kept separate from the template settings rather than overwriting them, so the template
        // values stay available as the lower-priority fallback. An unset player parameter comes
        // back as an empty string, which splitList drops.
        this.deviceBranchNames = String(values[0] ?? '');
        this.deviceDealerId = String(values[1] ?? '');
        this.setBranches(this.harmonyConfig.searchableBranchNames);
        this.loadAllCars();
      }).catch(e => {
        this.setBranches(this.harmonyConfig.searchableBranchNames);
        this.loadAllCars();
      })
    } else {
      this.setBranches(this.harmonyConfig.searchableBranchNames);
      this.loadAllCars();
    }
  }

  /**
   * Shared tail of initializeCars()'s three branches. An empty or failed inventory is invisible to
   * the visitor (they just see an empty list) but means a broken install, so both outcomes are
   * reported as Health events.
   */
  private loadAllCars() {
    this.getAllCars().subscribe({
      next: data => {
        this.allCars = data;
        this.unfilteredCars = this.allCars;
        this.inventoryLoaded$.next(true);
        this.analytics.track(false, 'Health',
          `Inventory loaded: ${data.length} cars via ${this.resolvedSource}`);
      },
      error: () => {
        this.inventoryLoaded$.next(true);
        this.analytics.track(false, 'Health', 'Inventory load failed');
      }
    });
  }

  setFilteredCars(filteredCars: VolvoLeveransklarabilar[]) {
    this.filteredCars.next(filteredCars);
  }

  // ── Insurance API ─────────────────────────────────────────────────────────
  /**
   * Submits an insurance inquiry to the Wayke API.
   * Requires a valid Wayke API token configured in Harmony template params.
   *
   * The token should be stored as a Harmony template parameter (WaykeApiToken)
   * and injected here via HarmonyConfigService.inventoryApiUrl
   */
  getWaykeInsurance(message: any): Observable<any> {
    console.log(message)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.harmonyConfig.waykeApiToken}`  // Uncomment when token is available
    });
    const url = 'https://ecom.wayke.se/insurance/inquiry';
    return this.http.post(url, message, { headers, responseType: 'text' });
  }

  // ── Config helpers ────────────────────────────────────────────────────────
  getCurrentBranch(): string {
    return this.harmonyConfig.lkbBranchName;
  }

  setBranches(value: any) {
    this.searchableBranchNames = value;
  }

  setLocationsCount(count: any) {
    this.carLocationsCount = count;
  }

  setStartCategory(category: any) {
    this.startCategory = category;
  }

  setSelectedCar(car: any) {
    this.selectedCar = car;
  }

  setAllBrandsAvailable() {
    this.allBrandsAvailable = this.harmonyConfig.allBrandsAvailable;
  }

  getDealerId(): string {
    return this.harmonyConfig.dealerId;
  }

  getInterestRate(): number {
    return this.harmonyConfig.interestRate;
  }
}
