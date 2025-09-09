import { ImmichApi } from './helpers/immichApi';
import { datetimeExtractor } from './helpers/datetimeExtractor';
import { Asset } from './models/asset';

console.log('🚀 Starting script... 🚀');

async function main() {
    // Create an instance of the ImmichApi class
    const api = new ImmichApi();

    // Get album information
    const albumInfo = await api.getAlbumData();

    console.warn('Album:', albumInfo.albumName);
    console.warn('Number of assets in album:', albumInfo.assetCount);

    // If album has no assets, stop
    if (albumInfo.assetCount === 0) {
        console.warn('No assets found in album. Stopping script.');
        return;
    }

    let counter = 0;
    let failedAssets: Asset[] = [];

    // Go through all assets and check the datetime
    for (const asset of albumInfo.assets) {
        console.log('---');
        console.log('Asset ID:', asset.id);
        console.log('Asset Name:', asset.originalFileName);

        // Use helper to get correct datetime if possible
        const extractedDate = datetimeExtractor.getDateTime(asset.originalFileName);
        if (extractedDate) {
            console.log('Extracted Date:', extractedDate.toISOString());

            // Save extracted date to asset (format: 2025-08-22T11:35:34.213464+00:00)
            asset.fileCreatedAt = extractedDate.toISOString().replace('Z', '+00:00');

            try {
                await api.putAssetData(asset);
                console.log('✅ Updated successful ✅');
                counter++;
            } catch (error) {
                console.error('❌ Error updating asset ❌:', error);
                failedAssets.push(asset);
            }
        } else {
            console.log('❓ No valid date found. ❓');
            failedAssets.push(asset);
        }
    }

    console.log(`\n🎉🎉🎉 DONE, updated ${counter} of the ${albumInfo.assetCount} assets 🎉🎉🎉`)
    console.log('Failed assets:', failedAssets.map(a => a.originalFileName));
}

main();