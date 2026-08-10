import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, combineLatest, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
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

  getAllCars(): Observable<VolvoLeveransklarabilar[]> {
    // let keys = this.getAPIKeys();
    let carList;
    let streamList = [];
    let branches = this.searchableBranchNames.split(',');

    for (let id in branches) {
      let url = `${this.harmonyConfig.inventoryApiUrl}/vehicles?hits=700&branch=${branches[id].trim()}`;

      streamList.push(
        this.http.get(url, {
          headers: { 'x-api-key': this.harmonyConfig.waykeApiToken }
        }))

    };
    // for (let id in keys) {
    //   let url = `${this.harmonyConfig.inventoryApiUrl}/vehicles`;

    //   console.log(keys[id])
    //   streamList.push(
    //     this.http.get(url, {
    //       headers: { 'x-api-key': keys[id].trim() }
    //     }))

    // };
    carList = forkJoin(streamList).pipe(
      map(data => this.formatCars(data))
    );

    return carList;
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

    retCar.isSelekt = carData.hasManufacturerPackaging === true &&
      (
        (carData.resellerPackagingOptions || [])
          .some(p => (p.title || '').toUpperCase().includes('SELEKT')) ||
        (carData.shortDescription || '').toUpperCase().includes('SELEKT')
      )


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
        this.setBranches(values[0]);
        this.harmonyConfig.searchableBranchNames = values[0];
        this.harmonyConfig.dealerId = values[1];
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
        this.analytics.track(false, 'Health', `Inventory loaded: ${data.length} cars`);
      },
      error: () => {
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
