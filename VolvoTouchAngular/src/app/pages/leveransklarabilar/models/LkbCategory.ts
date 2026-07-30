export class LkbCategory {
    name: string;
    filterName: string;
    filterInfo: string;
    filterType: string;
    src: string;
    copy: string;
    items: any[];
    categories: any[];
    constructor(name: string, filterName: string, filterInfo: string, filterType: string, src: string, hero_image: string, copy: string, categories: any[] = [], items: any[] = []) {
        this.name = name;
        this.filterName = filterName;
        this.filterInfo = filterInfo;
        this.filterType = filterType;
        this.src = src;
        this.copy = copy;
        this.items = items;
        this.categories = categories;
    }
}

export class VolvoLeveransklarabilar {
    id: number;
    waykeCarId: string;
    waykeBranchId: string;
    waykeBranchName: string;
    branch: string;
    location: string;
    regNr: string;
    manufacturer: string;
    manufactureYear: string;
    title: string;
    model: string;
    modelYear: number;
    shortDescription: string;
    milage: number;
    price: number;
    gear: string;
    fuel: string;
    color: string;
    vehicleType: string;
    horsePower: number;
    isSelekt: boolean;
    lastUpdated: Date;
    interestRate: string;
    effectiveInterestRate: string;
    medias: VolvoLeveransklarabilarMedia[];
    optionsCommaSeparated: string;
    street: string;
    zip: string;
    drivingWheel: string;
    fuelConsumption: string;
}

export class VolvoLeveransklarabilarOption {
    name: string;
}

export class VolvoLeveransklarabilarMedia {
    url: string;
    name: string;
    SortOrder: number;
}

export class LkbFilter {
    name: string;
    filterName: string;
    filterType: string;

    constructor(name: string, filterName: string, filterType: string) {
        this.name = name;
        this.filterName = filterName;
        this.filterType = filterType;
    }
}