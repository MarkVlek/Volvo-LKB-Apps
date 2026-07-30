import { Injectable } from "@angular/core";
import { RTCCategory } from "../pages/reason-to-choose/rtc-models/rtc-category.model";


const MaxCols: number = 12;
const MaxRows: number = 2;

export interface Tile {
    category: RTCCategory;
    cols: number;
    rows: number;
}

export interface TileVolume {
    cols: number;
    rows: number;
}

@Injectable()
export class CreateMatrixService {
    public CreatMatrix(categories: RTCCategory[]): Tile[] {
        let output: Tile[] = [];
        for (let i = 0; i < categories.length; i++) {
            let tileData: TileVolume = this.GetTileVolume(categories.length, i + 1);
            let tile: Tile = {
                category: categories[i],
                cols: tileData.cols,
                rows: tileData.rows,
            }
            output.push(tile);
        }
        return output;
    }

    private GetTileVolume(lenghtOfMatrix: number, tileIndex: number): TileVolume {
        console.log(lenghtOfMatrix)
        let output: TileVolume = {cols: 0 , rows: 0};
        switch (lenghtOfMatrix) {
            case 1:
                output.cols = MaxCols;
                output.rows = MaxRows;
                break;
            case 2:
                output.cols = MaxCols / 2
                output.rows = MaxRows
                break;
            case 3:
                if (tileIndex > 2) {
                    output.cols = MaxCols 
                    output.rows = MaxRows / 3
                }
                else {
                    output.cols = MaxCols / 2
                    output.rows = MaxRows / 3
                }
                break;
            case 4:
                output.cols = MaxCols / 2
                output.rows = MaxRows / 2
                break;
            case 5:
                if (tileIndex < 4) {
                    output.cols = MaxCols / 3
                    output.rows = MaxRows / 2
                }
                else {
                    output.cols = MaxCols / 2
                    output.rows = MaxRows / 2
                }
                break;
            case 6:
                output.cols = MaxCols / 3
                output.rows = MaxRows / 2
        }
        return output;
    }
}