import { RTCImage } from "./rtc-image.model";

export class RTCItem {
    has_loan_calculator: boolean;
    has_leasing_calculator: boolean;
    show_leasing_module: boolean;
    show_private_lease_module: boolean;
    show_business_lease_module: boolean;
    name: string;
    intro: string;
    text: string;
    preview_image: string;
    preview_image_md5: string;
    bullet_list: Bullet;
    video: string;
    image: string;
    video_md5: string;
    image_md5: string;
    original_image: string;
    original_image_md5: string;
    header1: string;
    text1: string;
    header2: string;
    text2: string;
    header3: string;
    text3: string;
    header4: string;
    text4: string;
    header5: string;
    text5: string;
    header6: string;
    text6: string;
    header7: string;
    text7: string;
    header8: string;
    text8: string;
    image_list: RTCImage[]
    readmore_url: string;
}
export class Bullet {
    bullets: BulletsList[];
}
export class BulletsList {
    bullets_list: string;
}