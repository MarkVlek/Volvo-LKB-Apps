export class RTCFiltered {
    category: string;
    subCategory: string;
    item: string;
    name: string;
    image: string;

    constructor(category: string, subCategory: string, item: string, name: string, image: string) {
        this.category = category;
        this.subCategory = subCategory;
        this.item = item;
        this.name = name;
        this.image = image;
    }
}