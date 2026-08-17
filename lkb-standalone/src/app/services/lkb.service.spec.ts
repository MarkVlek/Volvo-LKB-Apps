import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LkbService } from './lkb.service';
import { HarmonyConfigService } from './harmony-config.service';
import { AnalyticsService } from './analytics.service';
import mframe from '../../mframe.json';

/**
 * Covers inventory source resolution — the priority chain, the single-request form, and the
 * branch-then-organisation probing that makes a bare Wayke ID usable without knowing its level.
 * See docs/superpowers/specs/2026-08-06-inventory-source-design.md.
 */
describe('LkbService — inventory sources', () => {

  let service: LkbService;
  let http: HttpTestingController;
  let config: any;

  const API = 'https://api.wayke.se/search';

  /** Minimal search response carrying `count` vehicles. */
  function response(count: number) {
    return {
      documentList: {
        documents: Array.from({ length: count }, (_, i) => ({
          _id: `id-${i}`,
          manufacturer: 'Volvo',
          title: 'Volvo XC60',
          hasManufacturerPackaging: false,
          branches: [{ id: 'b', name: 'Branch', parentId: 'p' }],
          media: [],
        }))
      }
    };
  }

  beforeEach(() => {
    config = {
      inventoryApiUrl: API,
      waykeApiToken: 'token',
      dealerId: '',
      searchableBranchNames: '',
      lkbBranchName: '',
      allBrandsAvailable: false,
      locationFilters: [],
      interestRate: 7.95,
      sessionIdleTimeoutSeconds: 180,
      params: {},
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LkbService,
        { provide: HarmonyConfigService, useValue: config },
        { provide: AnalyticsService, useValue: { track: () => { } } },
      ]
    });

    service = TestBed.inject(LkbService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('asks for several branches in ONE request instead of one request each', () => {
    service.searchableBranchNames = 'Branch A, Branch B, Branch C';

    service.getAllCars().subscribe();

    const req = http.expectOne(r => r.url.includes('/vehicles'));
    expect(req.request.url).toContain('branch=Branch%20A');
    expect(req.request.url).toContain('branch=Branch%20B');
    expect(req.request.url).toContain('branch=Branch%20C');
    req.flush(response(3));
  });

  /**
   * Branch names reach the app in two shapes: typed by hand into Harmony with the Swedish letters
   * intact, or read from the player already percent-encoded. Encoding the encoded form turns its
   * `%` into `%25`, which cost Bilia 290 of 544 vehicles — measured live, 11 of their 19 branch
   * names carry an encoded letter.
   */
  it('encodes a branch name that was typed with Swedish letters', () => {
    service.searchableBranchNames = 'Bilia Jägersro Volvo';

    service.getAllCars().subscribe();

    const req = http.expectOne(r => r.url.includes('/vehicles'));
    expect(req.request.url).toContain('branch=Bilia%20J%C3%A4gersro%20Volvo');
    req.flush(response(1));
  });

  it('does not re-encode an already percent-encoded branch name', () => {
    service.searchableBranchNames = 'Bilia J%C3%A4gersro Volvo';

    service.getAllCars().subscribe();

    const req = http.expectOne(r => r.url.includes('/vehicles'));
    // The player encodes the letters but leaves the spaces, so the URL is only half-formed until
    // those are encoded too. Relying on the browser to tidy that up leaves a URL that other HTTP
    // clients reject outright.
    expect(req.request.url).toContain('branch=Bilia%20J%C3%A4gersro%20Volvo');
    expect(req.request.url).not.toContain('%25');
    req.flush(response(1));
  });

  it('decides per name, not per setting, when the two shapes are mixed', () => {
    service.searchableBranchNames = 'Bilia T%C3%A4by Volvo, Bilia Kungälv Volvo';

    service.getAllCars().subscribe();

    const req = http.expectOne(r => r.url.includes('/vehicles'));
    expect(req.request.url).toContain('T%C3%A4by');
    expect(req.request.url).toContain('Kung%C3%A4lv');
    expect(req.request.url).not.toContain('%25');
    req.flush(response(1));
  });

  it('raises the hit ceiling above the largest dealer', () => {
    service.searchableBranchNames = 'Branch A';
    service.getAllCars().subscribe();

    const req = http.expectOne(r => r.url.includes('/vehicles'));
    expect(req.request.url).toContain('hits=2000');
    req.flush(response(1));
  });

  it('prefers a device dealer ID over every other source', () => {
    service.deviceDealerId = 'device-id';
    service.deviceBranchNames = 'Device Branch';
    config.dealerId = 'template-id';
    service.searchableBranchNames = 'Template Branch';

    service.getAllCars().subscribe();

    const req = http.expectOne(r => r.url.includes('/vehicles'));
    expect(req.request.url).toContain('branchId=device-id');
    req.flush(response(5));
  });

  it('prefers device branch names over the template dealer ID', () => {
    service.deviceBranchNames = 'Device Branch';
    config.dealerId = 'template-id';

    service.getAllCars().subscribe();

    const req = http.expectOne(r => r.url.includes('/vehicles'));
    expect(req.request.url).toContain('branch=Device%20Branch');
    req.flush(response(2));
  });

  it('treats an ID as an organisation when no showroom matches it', () => {
    service.deviceDealerId = 'org-id';

    let result = [];
    service.getAllCars().subscribe(cars => result = cars);

    // A showroom ID is tried first and comes back empty...
    const asBranch = http.expectOne(r => r.url.includes('branchId=org-id'));
    asBranch.flush(response(0));

    // ...so the same value is retried as an organisation.
    const asParent = http.expectOne(r => r.url.includes('parentId=org-id'));
    asParent.flush(response(7));

    expect(result.length).toBe(7);
  });

  it('shows nothing rather than another dealer stock when the ID matches nothing at all', () => {
    service.deviceDealerId = 'bad-id';
    service.searchableBranchNames = 'Template Branch';

    let result = null;
    service.getAllCars().subscribe(cars => result = cars);

    http.expectOne(r => r.url.includes('branchId=bad-id')).flush(response(0));
    http.expectOne(r => r.url.includes('parentId=bad-id')).flush(response(0));

    // Showing one dealer's inventory on another dealer's screen is not permitted, so a mis-typed
    // ID must leave the screen empty instead of cascading to the next-best setting.
    http.expectNone(r => r.url.includes('branch='));
    expect(result).toEqual([]);
  });

  it('does not fall back from the device settings to the template settings', () => {
    service.deviceBranchNames = 'Device Branch';
    config.dealerId = 'template-id';
    service.searchableBranchNames = 'Template Branch';

    let result = null;
    service.getAllCars().subscribe(cars => result = cars);

    http.expectOne(r => r.url.includes('branch=Device%20Branch')).flush(response(0));

    http.expectNone(() => true);
    expect(result).toEqual([]);
  });

  it('makes no request when nothing is configured', () => {
    let result = null;
    service.getAllCars().subscribe(cars => result = cars);

    http.expectNone(() => true);
    expect(result).toEqual([]);
  });
});

/**
 * The shipped mframe defaults are what an unconfigured player runs on, so a non-empty inventory
 * setting here would put the sample dealer's cars on every screen that nobody has configured yet.
 */
describe('Harmony template defaults', () => {

  const components: any[] = (mframe as any).components;

  function param(name: string) {
    return components
      .reduce((all, component) => all.concat(component.params), [])
      .find(p => p.name === name);
  }

  it('selects no inventory until a dealer is configured', () => {
    expect(param('DealerId').value).toBe('');
    expect(param('LkbBranchName').value).toBe('');
  });
});

describe('LkbService — Selekt detection', () => {

  let service: LkbService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LkbService,
        { provide: HarmonyConfigService, useValue: { locationFilters: [] } },
        { provide: AnalyticsService, useValue: { track: () => { } } },
      ]
    });
    service = TestBed.inject(LkbService);
  });

  function car(extra: any) {
    return service.formatCar({ manufacturer: 'Volvo', media: [], ...extra });
  }

  it('marks a certified Volvo as Selekt without requiring the marketing block', () => {
    // The bug: most dealers never attach resellerPackagingOptions, so requiring it hid whole
    // sites' Selekt stock — 10 flagged cars showing as 1.
    expect(car({ hasManufacturerPackaging: true, resellerPackagingOptions: [] }).isSelekt).toBeTrue();
  });

  it('still marks it when the marketing block is present', () => {
    expect(car({
      hasManufacturerPackaging: true,
      resellerPackagingOptions: [{ title: 'Volvo Selekt Inclusive' }]
    }).isSelekt).toBeTrue();
  });

  it('does not mark a vehicle without the certified flag', () => {
    expect(car({ hasManufacturerPackaging: false }).isSelekt).toBeFalse();
    expect(car({}).isSelekt).toBeFalse();
  });

  it('does not mark a non-Volvo even if it carries the flag', () => {
    expect(car({ manufacturer: 'BMW', hasManufacturerPackaging: true }).isSelekt).toBeFalse();
  });
});
