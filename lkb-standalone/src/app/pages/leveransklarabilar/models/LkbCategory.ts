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
    optionsCommaSeparated: string[];
    street: string;
    zip: string;
    drivingWheel: string;
    fuelConsumption: string;
    constructor(id: number,
        waykeCarId: string,
        waykeBranchId: string,
        waykeBranchName: string,
        branch: string,
        location: string,
        regNr: string,
        manufacturer: string,
        manufactureYear: string,
        title: string,
        model: string,
        modelYear: number,
        shortDescription: string,
        milage: number,
        price: number,
        gear: string,
        fuel: string,
        color: string,
        vehicleType: string,
        horsePower: number,
        isSelekt: boolean,
        lastUpdated: Date,
        interestRate: string,
        effectiveInterestRate: string,
        medias: VolvoLeveransklarabilarMedia[],
        optionsCommaSeparated: string[],
        street: string,
        zip: string,
        drivingWheel: string,
        fuelConsumption: string) {
        this.id = id;
        this.waykeCarId = waykeCarId;
        this.waykeBranchId = waykeBranchId;
        this.waykeBranchName = waykeBranchName;
        this.branch = branch;
        this.location = location;
        this.regNr = regNr;
        this.manufacturer = manufacturer;
        this.manufactureYear = manufactureYear;
        this.title = title;
        this.model = model;
        this.modelYear = modelYear;
        this.shortDescription = shortDescription;
        this.milage = milage;
        this.price = price;
        this.gear = gear;
        this.fuel = fuel;
        this.color = color;
        this.vehicleType = vehicleType;
        this.horsePower = horsePower;
        this.isSelekt = isSelekt;
        this.lastUpdated = lastUpdated;
        this.interestRate = interestRate;
        this.effectiveInterestRate = effectiveInterestRate;
        this.medias = medias;
        this.optionsCommaSeparated = optionsCommaSeparated;
        this.street = street;
        this.zip = zip;
        this.drivingWheel = drivingWheel;
        this.fuelConsumption = fuelConsumption;
    }
}

/**
 * One-line description of a vehicle for analytics `details` strings, so every event that names a
 * car names it identically. Missing fields are dropped rather than printed as "undefined".
 */
export function describeCar(car: VolvoLeveransklarabilar): string {
    if (!car) return 'unknown vehicle';

    const price = car.price
        ? new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', minimumFractionDigits: 0 }).format(car.price)
        : null;

    const facts = [
        car.modelYear,
        price,
        car.milage != null ? `${car.milage} mil` : null,
        car.fuel,
        car.waykeBranchName || car.branch,
    ].filter(Boolean);

    const title = car.title || car.model || 'unknown vehicle';
    const described = facts.length ? `${title} — ${facts.join(', ')}` : title;

    return car.isSelekt ? `${described} [Selekt]` : described;
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