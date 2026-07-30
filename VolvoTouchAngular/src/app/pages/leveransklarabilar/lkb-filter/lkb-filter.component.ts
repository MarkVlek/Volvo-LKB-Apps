import { AfterViewInit, Component, Input, OnInit, Renderer2, signal } from '@angular/core';
import { MinMaxOutput } from 'src/app/components/lkb-slider/lkb-slider.component';
import { LkbService } from 'src/app/services/lkb.service';
import { LkbCategory, LkbFilter, VolvoLeveransklarabilar } from '../models/LkbCategory';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-lkb-filter',
  templateUrl: './lkb-filter.component.html',
  styleUrls: ['./lkb-filter.component.scss']
})

export class LkbFilterComponent implements OnInit, AfterViewInit {
  @Input() cars: any[] = [];

  readonly panelOpenState = signal(false);

  //Regular filters
  carModels: any = [];
  carColors: LkbFilter[] = [];
  carLocations: any = [];
  carFuels: any = [];
  carTypes: any = [];
  carGearboxes: any = [];
  carManufacturers: any = [];
  carCategeries: any = [];

  //Slider filters
  carModelYears: any = [];
  carPrices: any = [];
  carMileages: any = [];
  carHorsePower: any = [];

  //Filters active now
  selectedOptions: any = [];

  value: any;
  highValue: any;

  //Conditionals
  showAllBrands: boolean = false;
  allBrandsAvailable: any;

  //Highest and lowest values of filters
  latestModelYear: number;
  earliestModelYear: number;
  highestPrice: number;
  lowestPrice: number;
  highestMiles: number;
  lowestMiles: number;
  highestHorsePower: number;
  lowestHorsePower: number;

  // Sliders
  yearSlider: MinMaxOutput = new MinMaxOutput(2010, 2030);
  priceSlider: MinMaxOutput = new MinMaxOutput(0, 2000000);
  milageSlider: MinMaxOutput = new MinMaxOutput(0, 400000);
  horsePowerSlider: MinMaxOutput = new MinMaxOutput(60, 790);

  constructor(public lkbService: LkbService, private renderer: Renderer2, private configService: ConfigService) { }

  ngAfterViewInit(): void {
  }


  ngOnInit(): void {
    this.lkbService.setAllBrandsAvailable();
    this.initFilters();
    // Set the style of this filter button as active...
    this.lkbService.setLocationsCount(this.carLocations ? this.carLocations.length : 0);
    this.allBrandsAvailable = this.configService.config["VolvoEndlessAisle_LKBAllBrandsAvailable"]?.toString().toLowerCase();
    this.setStartingCategory(this.carCategeries)
  }

  initFilters(skipCategories = false) {
    if (this.showAllBrands == true) {
      this.lkbService.allCars = this.lkbService.unfilteredCars;
    }
    if (skipCategories == false) {
      this.carCategeries = this.lkbService.getCategoryTypes();
    }
    this.carModels = this.getCarModelFilters().sort((a, b) => a.name.localeCompare(b.name));
    this.carColors = this.getCarColorFilters().sort((a, b) => a.name.localeCompare(b.name));
    this.carLocations = this.getCarLocationFilters().sort((a, b) => a.name.localeCompare(b.name));

    this.carFuels = this.getcarFuelFilters().sort((a, b) => a.name.localeCompare(b.name));
    this.carTypes = this.getcarTypeFilters().sort((a, b) => a.name.localeCompare(b.name));
    this.carGearboxes = this.getcarGearboxFilters().sort((a, b) => a.name.localeCompare(b.name));
    this.carManufacturers = this.getmanufacturerFilters().sort((a, b) => a.name.localeCompare(b.name));

    this.initSliderFilters();
  }

  initFiltersByManufacturer(manufacturer: string) {
    if (this.showAllBrands == true) {
      this.lkbService.allCars = this.lkbService.unfilteredCars;
    }
    this.carCategeries = this.lkbService.getCategoryTypes();
    this.carModels = this.getCarModelFilters(manufacturer).sort((a, b) => a.name.localeCompare(b.name));
    this.carColors = this.getCarColorFilters().sort((a, b) => a.name.localeCompare(b.name));
    this.carLocations = this.getCarLocationFilters().sort((a, b) => a.name.localeCompare(b.name));

    this.carFuels = this.getcarFuelFilters().sort((a, b) => a.name.localeCompare(b.name));
    this.carTypes = this.getcarTypeFilters().sort((a, b) => a.name.localeCompare(b.name));
    this.carGearboxes = this.getcarGearboxFilters().sort((a, b) => a.name.localeCompare(b.name));

    this.initSliderFilters();
  }

  initSliderFilters(alreadyFiltered = false) {
    if(alreadyFiltered == false) {
      this.carModelYears = this.getUniqueFilterCollection('modelYear');
      this.carPrices = this.getUniqueFilterCollection('price');
      this.carMileages = this.getUniqueFilterCollection('milage');
    }
    // this.carHorsePower = this.getUniqueFilterCollection('horsePower');

    if(alreadyFiltered == true) {
      this.carModelYears = this.lkbService.filteredCars.value.map(car => car.modelYear);
      this.carPrices = this.lkbService.filteredCars.value.map(car => car.price ?? 0);
      this.carMileages = this.lkbService.filteredCars.value.map(car => car.milage)
    }

    this.latestModelYear = Math.max(...this.carModelYears)
    this.earliestModelYear = Math.min(...this.carModelYears)
    this.highestPrice = Math.max(...this.carPrices)
    this.lowestPrice = Math.min(...this.carPrices)
    this.highestMiles = Math.max(...this.carMileages)
    this.lowestMiles = Math.min(...this.carMileages)
    this.highestHorsePower = Math.max(...this.carHorsePower)
    this.lowestHorsePower = Math.min(...this.carHorsePower)

    this.milageSlider.max = this.highestMiles;
    this.milageSlider.min = this.lowestMiles;

    this.priceSlider.max = this.highestPrice;
    this.priceSlider.min = this.lowestPrice;

    this.yearSlider.max = this.latestModelYear;
    this.yearSlider.min = this.earliestModelYear;
  }

  getCarModelFilters(manufacturer: string = null) {
    return this.createFilterSection('model', this.showAllBrands, manufacturer);
  }

  getCarColorFilters() {
    return this.createFilterSection('color', this.showAllBrands);
  }

  getCarLocationFilters() {
    // return this.CreateFilterSection('Location', this.lkbService.allBrandsAvailable);
    return this.createFilterSection('waykeBranchName', this.showAllBrands);
  }

  getcarFuelFilters() {
    return this.createFilterSection('fuel', this.showAllBrands);
  }

  getcarTypeFilters() {
    return this.createFilterSection('vehicleType', this.showAllBrands);
  }

  getcarGearboxFilters() {
    return this.createFilterSection('gear', this.showAllBrands);
  }

  getmanufacturerFilters() {
    return this.createFilterSection('manufacturer', this.showAllBrands);
  }

  createFilterSection(filterField, allBrandsAvailable = false, manufacturer: string = null) {

    if (allBrandsAvailable != true) {
      this.lkbService.allCars = this.lkbService.unfilteredCars.filter(car => car.manufacturer === "Volvo");
    }

    if(manufacturer) {
      this.lkbService.allCars = this.lkbService.unfilteredCars.filter(car => car.manufacturer === manufacturer)
    }

    let filters = this.getUniqueFilterCollection(filterField, filterField === 'waykeBranchName');

    return filters.map(filter => (
      {
        name: filter,
        filterName: filter,
        filterType: filterField
      }
    ));
  }

  getUniqueFilterCollection(filterField, filterIsLocation = false) {
    if (filterIsLocation) {
      const locationFilteredCars = this.lkbService.allCars.filter(car => !car.waykeBranchName.toString().includes("/") && !(car.waykeBranchName.toString() === ""));
      return Array.from(new Set(locationFilteredCars.map(car => car[filterField])));
    }

    return Array.from(new Set(this.lkbService.allCars.map(car => car[filterField])));
  }

  toggleShowAllBrands() {
    if(this.showAllBrands == false) {
      this.showAllBrands = true;
      this.lkbService.allCars = this.lkbService.unfilteredCars;
      this.selectedOptions = [];
      this.initFilters();
      this.filter();
    }
  }

  toggleSelected(selected) {
    const index = this.selectedOptions.findIndex(option => option.filterName === selected.filterName);
    if (selected.filterType == "manufacturer") {
      if (index !== -1) {
        this.selectedOptions.splice(index, 1)
        this.initFilters();
        this.filter();
      }
      else {
        this.selectedOptions = [];
        this.initFiltersByManufacturer(selected.filterName)
        this.selectedOptions.push(selected);
        this.filter();
      }
    }
    else {
      if (index !== -1) {
        this.selectedOptions.splice(index, 1);
      } else {
        this.selectedOptions.push(selected);
      }
      this.filterNoSliders();
      this.initSliderFilters(true)
    }
  }

  setCategory(category) {
    const index = this.selectedOptions.indexOf(this.selectedOptions.find(x => x.filterType == 'Category'));
    if(this.showAllBrands == true) {
      this.showAllBrands = false;
      this.lkbService.allCars = this.lkbService.unfilteredCars;
      this.initFilters(true);
      this.filter();
    }
    if(!this.selectedOptions.includes(category)) {
      this.selectedOptions.splice(index, 1)
      this.selectedOptions = [...this.selectedOptions, category];
      this.filterNoSliders();
      this.initSliderFilters(true)
    }
  }

  setStartingCategory(categories: LkbCategory[]) {
    for (let category of categories) {
      if (category.name === this.lkbService.startCategory.name){
        this.setCategory(category)
      }
    }
    
  }

  filter() {
    this.lkbService.setFilteredCars(this.lkbService.allCars.filter(car => {
      return this.filterBy('model', car) &&
        this.filterBy('category', car) &&
        this.filterBy('gear', car) &&
        this.filterBy('fuel', car) &&
        this.filterBy('color', car) &&
        this.filterBy('waykeBranchName', car) &&
        this.filterBy('manufacturer', car) &&
        this.yearSlider.min <= car.modelYear && car.modelYear <= this.yearSlider.max &&
        this.priceSlider.min <= car.price && car.price <= this.priceSlider.max &&
        this.milageSlider.min <= car.milage && car.milage <= this.milageSlider.max &&
        this.horsePowerSlider.min <= car.horsePower && car.horsePower <= this.horsePowerSlider.max
    }));
  }

  filterNoSliders() {
    this.lkbService.setFilteredCars(this.lkbService.allCars.filter(car => {
      return this.filterBy('model', car) &&
        this.filterBy('category', car) &&
        this.filterBy('gear', car) &&
        this.filterBy('fuel', car) &&
        this.filterBy('color', car) &&
        this.filterBy('waykeBranchName', car) &&
        this.filterBy('manufacturer', car)
    }));
  }

  filterBy(filterType, car) {
    let filters = this.getFilter(filterType);

    if (filterType === 'category') {
      return filters.length === 0 || filters.some(category => this.categoryFilter(category, car));
    }

    return filters.length === 0
      || filters.some(type => car[filterType].toUpperCase() === type.name.toUpperCase());
  }

  getFilter(filterType) {
    return this.selectedOptions.filter(option => {
      return option.filterType.toUpperCase() === filterType.toUpperCase();
    });
  }

  categoryFilter(category, car) {
    switch (category.filterName.toUpperCase()) {
      case "NYA BILAR":
        return (car.manufacturer.toUpperCase() === 'VOLVO' && car.milage <= 25)
      case "SELEKT":
        return (car.manufacturer.toUpperCase() === 'VOLVO' && car.isSelekt);
      case "ALLA BILAR":
        return (car.manufacturer.toUpperCase() === 'VOLVO');
      default:
        return true;
    }

  }

  toggleSidebar() {
    this.lkbService.sideBar = !this.lkbService.sideBar
  }

  //#region Slider methods
  yearChangeLatest(event: Event) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.yearSlider.max = value;
    this.filter()
  }

  yearChangeNewest(event: Event) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.yearSlider.min = value;
    this.filter()
  }

  priceChangeHighest(event: Event) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.priceSlider.max = value;
    this.filter()
  }

  priceChangeLowest(event: Event) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.priceSlider.min = value;
    this.filter()
  }

  milageChangeLowest(event: Event) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.milageSlider.min = value;
    this.filter()
  }

  milageChangeHighest(event: Event) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.milageSlider.max = value;
    this.filter()
  }

  horsePowerChange(output: MinMaxOutput) {
    this.horsePowerSlider.min = output.min;
    this.horsePowerSlider.max = output.max;
    this.filter()
  }
  //#endregion
}
