import { Asset } from "./asset";

export interface Album {
    albumName: string;
    assetCount: number;
    assets: Asset[];
}