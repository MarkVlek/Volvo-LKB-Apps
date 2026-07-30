export class Agenda {
    regNum: string;
    carModel: string;
    color: string;
    carSpecs: string[];
    customerName: string;
    screenSaverName: string;
    categoryGroups: CategoryGroup[];
    categories: Category[];
    fdsData: FdsData;
    engine: string;
    vin: string;
    gearbox: string;
}

export class CategoryGroup {
    title: string;
    show: boolean;
    remind: Boolean;
    categories: Category[];
}

export class Category {
    name: string;
    sortOrder: number;
    subheading: string;
    info: string;
    show: boolean;
    remind: Boolean;
    accessories: Accessories[];
}

export class Accessories {
    id: number;
    name: string;
    title: string;
    subTitle: string;
    bodyText: string;
    commaSeparatedSpecs: string;
    price: string;
    sortOrder: number;
    medias: Media[];
}

export class Media {
    name: string;
    sortOrder: number;
}

export interface FdsData {
    bookingDetails: BookingDetails,
    customerDetails: CustomerDetails,
    orderDetails: OrderDetails,
    orderFeatureDetails: OrderFeatureDetails[],
    workOrderDetails: WorkOrderDetails[],
}

export interface BookingDetails {
    additionalComments: string,
    deliveryDate: string,
    deliverySpecialist: string,
    homeShipmentDate: string,
    homeShipmentLocation: string,
    winterTiresRequired: boolean,
    deliveryTime: string
}

export interface CustomerDetails {
    firstName: string,
    surname: string,
    address: string,
    city: string
}

export interface OrderDetails {
    carType: string,
    commercialModelYear: string,
    customerType: string,
    license: string,
    orderNotes: string,
    staff: string,
    vistaOrderId: string
}

export interface OrderFeatureDetails {
    group: string,
    type: string
}

export interface WorkOrderDetails {
    adjustedReady: string,
    completedDate: string,
    damageReportNum: string,
    expectedReady: string,
    plannedStart: string,
    pointOfSales: string,
    salesPerson: string,
    status: string,
    workOrderId: number,
    workOrderAccessories: WorkOrderAccessories[]
}

export interface WorkOrderAccessories {
    workOrderDescription: string,
    quantity: string
}