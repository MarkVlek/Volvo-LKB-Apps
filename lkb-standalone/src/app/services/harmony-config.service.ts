import { Injectable } from '@angular/core';

/**
 * HarmonyConfigService
 *
 * Replaces the original ConfigService dependency for the LKB module.
 * Reads all player/dealer configuration from the Harmony CMS window.Loader API,
 * which is populated from the mframe.json template parameter definitions.
 *
 * In development (when window.Loader is not available) sensible defaults are used
 * so the app can be run locally with `ng serve` against a mock API.
 */
@Injectable({ providedIn: 'root' })
export class HarmonyConfigService {

  public params: Record<string, string> = {};

  constructor() {
    this.loadFromLoader();
  }

  private loadFromLoader(): void {
    try {
      // window.Loader is injected by the Harmony player runtime
      const loader = (window as any).Loader;
      if (loader) {
        loader.getComponents().then((components) => {
          function p(componentName, paramName) {
            try {
              var result = components.filter(function (component) {
                return component.name === componentName;
              })[0];
              if (paramName)
                result = result.params.filter(function (param) {
                  return param.name === paramName;
                })[0].value;
              return result;
            } catch (e) {
              console.error('Could not find component "' + componentName + '" and/or param "' + paramName + '"');
              throw e;
            }
          }

          this.params = {
            InventoryApiUrl: p('Inventory Settings', 'InventoryApiUrl'),
            DealerId: p('Fallback Settings', 'DealerId'),
            LkbBranchName: p('Inventory Settings', 'LkbBranchName'),
            SearchableBranchNames: p('Inventory Settings', 'LkbBranchName'),
            InterestRate: p('Fallback Settings', 'InterestRate'),
            AllBrandsAvailable: p('Inventory Settings', 'AllBrandsAvailable').toString(),
            WaykeApiToken: p('Inventory Settings', 'WaykeApiToken'),
            NameFilters: p('Inventory Settings', 'DealershipNameFilters'),
          };

          loader.ready();
        });
      } else {
        console.warn('[HarmonyConfigService] window.Loader not available — using dev defaults.');
        this.params = this.devDefaults();
      }
    } catch {
      this.params = this.devDefaults();
    }
  }

  // ── Parameter accessors ───────────────────────────────────────────────────

  /** Base URL for the Wayke/cloud inventory API endpoint. */
  get inventoryApiUrl(): string {
    return this.params['InventoryApiUrl'] ?? '';
  }

  /** Dealer/branch ID used for insurance API calls. */
  get dealerId(): string {
    return this.params['DealerId'] ?? '';
  }
  set dealerId(value: string) {
    this.params['DealerId'] = value;
  }
  /** Branch name used to suppress multi-location labels when single branch. */
  get lkbBranchName(): string {
    return this.params['LkbBranchName'] ?? '';
  }

  /** Branch name used to suppress multi-location labels when single branch. */
  get searchableBranchNames(): string {
    return this.params['SearchableBranchNames'] ?? '';
  }
  set searchableBranchNames(value: string) {
    this.params['SearchableBranchNames'] = value;
  }

  /** Annual interest rate (%) used as fallback for the finance calculator. */
  get interestRate(): number {
    return parseFloat(this.params['InterestRate'] ?? '7.95');
  }

  /** Whether to show the multi-brand toggle and manufacturer filter. */
  get allBrandsAvailable(): boolean {
    return (this.params['AllBrandsAvailable'] ?? 'false').toLowerCase() === 'true';
  }

  /** Dealer name replacements */
  get locationFilters(): string[] {
    let filterParam = this.params['NameFilters'];
    if (Array.isArray(filterParam)) return filterParam;
    else return [];
  }

  /**
   * Wayke API authentication token.
   */
  get waykeApiToken(): string {
    return this.params['WaykeApiToken'] ?? '';
  }

  // ── Dev defaults ──────────────────────────────────────────────────────────

  private devDefaults(): Record<string, any> {
    return {
      InventoryApiUrl: 'https://api.wayke.se/search',
      DealerId: 'fab817e9-3c81-4b50-ae67-43003b2e6274',
      LkbBranchName: 'Bildeve AB - Bergahuset',
      SearchableBranchNames: 'Bildeve AB - Bergahuset, Bildeve AB - Landskrona, Volvo Car Hisings Backa',
      InterestRate: '7.95',
      AllBrandsAvailable: 'false',
      WaykeApiToken: '68OaLKCeo4M6ZnHs8NPxZuvFuDdyA9EM',
      NameFilters: [
        "AHLBERG BIL|Ahlberg Bil | ",
        "BILBOLAGET|Bilbolaget | ",
        "BILDEVE|Bildeve AB - | ",
        "BILIA|Bilia| ",
        "BILKOMPANIET|Bilkompaniet i | ",
        "BILMÅNSSON|Bilmånsson | ",
        "BOGESUNDS|Bogesunds Bil | ",
        "BRANDT BIL|Brandt Bil - | ",
        "FINNVEDENS|Finnvedens Bil | ",
        "HELMIA|Helmia Bil AB | ",
        "LILJAS|Liljas Personbilar | ",
        "NYBERGS|Nybergs Bil | ",
        "REJMES|Rejmes Halland - | ",
        "ROLF|Rolf Ericson Bil | ",
        "SKOBES|Skobes Bil | ",
        "STENDAHLS|Stendahls Bil | ",
        "VOLVO CAR|Volvo Car | "
      ]
    };
  }
}
