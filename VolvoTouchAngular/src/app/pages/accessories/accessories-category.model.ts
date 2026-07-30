export class AccessoriesCategory {
    id: Number;
    name: string;
    locale: string;
    accessories: VolvoAccessory[];
    media: VolvoAccessoryMedia;
    sortOrder: number;
}

export class VolvoAccessory {
    id: Number;
    code: string;
    name: string;
    description: string;
    language: string;
    policy: string;
    year: Number;
    carModel: string;
    medias: VolvoAccessoryMedia[];
  }
  
  export class VolvoAccessoryMedia {
    id: Number;
    name: string;
    filePath?: string;
    url?: string;
    externalETag?: string;
    internalETag?: string;
  }