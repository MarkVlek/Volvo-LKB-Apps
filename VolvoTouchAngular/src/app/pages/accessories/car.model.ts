export class CarModel {
    title: string;
    displayTitle: string;
    modelCodes: ModelCodes[];
    img: string;
    cachedImg: string;
}

export class ModelCodes {
    year: number;
    code: number;
}