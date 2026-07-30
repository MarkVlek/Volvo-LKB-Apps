export class LkbInsurance {
    name: string;
    addOns: Addons[];
    description: string;
    price: number;
    unit: string;
    branding: string;
    insuranceItems: InsuranceItems[];
}

export class InsuranceItems {
    name: string;
    description: string;
}

export class Addons {
    description: string;
    monthlyPrice: number;
    name: string;
    price: number;
    title: string;
}