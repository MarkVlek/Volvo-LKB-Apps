export class DiseControlFile {
    media: Media;
    attributes: Attributes[];
    playlists: Playlists
}

export class Media {
    size: number;
    mtime: number;
    validFrom: number;
    validTo: number;
    name: string;
    uiName: string;
    mediaId: string;
}

export class Attributes {
    name: string;
    label: string;
    data: string;
    active: boolean;
}

export class Playlists {
    ROOT: Root
}

export class Root {
    blocks: Block
}

export class Block {
    blockId: string
    name: string
    segments: Segment[]
}

export class Segment {
    mediaId: string
}