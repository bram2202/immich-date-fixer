import { Album } from '../models/album';
import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';
import { Asset } from '../models/asset';
import { AssetPutDto } from '../models/assetPutDto';
dotenv.config();

export class ImmichApi {

    private API_URL = process.env.IMMICH_API_URL;
    private API_KEY = process.env.IMMICH_API_KEY;
    private ALBUM_ID = process.env.IMMICH_ALBUM_ID;

    constructor() {
        if (!this.API_URL || !this.API_KEY || !this.ALBUM_ID) {
            throw new Error('Missing IMMICH_API_URL, IMMICH_API_KEY or IMMICH_ALBUM_ID in environment variables.');
        }
    }

    async getAlbumData(): Promise<Album> {
        return this.executeGetCall(`albums/${this.ALBUM_ID}`);
    }

    async putAssetData(asset: Asset): Promise<void> {

        // Convert asset to AssetPutDto
        const assetPutDto: AssetPutDto = {
            ids: [asset.id],
            dateTimeOriginal: asset.fileCreatedAt,
        };

        return this.executePutCall(`assets`, assetPutDto);
    }

    private async executeGetCall(path: string) {
        const url = `${this.API_URL}/api/${path}`;
        try {
            const response = await axios.get(url, {
                headers: {
                    'X-API-Key': `${this.API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;

        } catch (error: unknown | AxiosError) {
            if (axios.isAxiosError(error)) {
                console.error('PUT API call failed:', error.response?.data || error.message);
                throw error;
            } else {
                console.error('PUT API call failed');
                throw error;
            }
        }
    }

    private async executePutCall(path: string, body: any) {
        const url = `${this.API_URL}/api/${path}`;
        try {
            const response = await axios.put(url, body, {
                headers: {
                    'X-API-Key': `${this.API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;

        } catch (error: unknown | AxiosError) {
            if (axios.isAxiosError(error)) {
                console.error('PUT API call failed:', error.response?.data || error.message);
                throw error;
            } else {
                console.error('PUT API call failed');
                throw error;
            }
        }
    }

}