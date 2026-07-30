import { RTCItem } from "./rtc-item.model";

export class RTCCategory {
    name: string;
    src: string;
    header: string;
    text: string;
    hero_image: string;
    items: RTCItem[];
    categories: RTCCategory[];
    has_loan_calculator: boolean;
    has_leasing_calculator: boolean;
    thumbnail: string;
    hero_video: string;
    constructor(name: string, src: string, header: string, text: string, hero_image: string, categories: any[] = [], items: any[] = [], has_loan_calculator: boolean = false, thumbnail: string, hero_video: string = '', has_leasing_calculator: boolean = false) {
        this.name = name;
        this.src = src;
        this.header = header;
        this.text = text;
        this.hero_image = hero_image === '' ? thumbnail : hero_image;
        this.items = items;
        this.categories = categories;
        this.has_loan_calculator = has_loan_calculator;
        this.has_leasing_calculator = has_leasing_calculator;
        this.thumbnail = thumbnail === undefined ? src : thumbnail;
        this.hero_video = hero_video;
    }
}