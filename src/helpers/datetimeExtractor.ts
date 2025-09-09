export class datetimeExtractor {

    // Try to distill datetime from filename
    // Examples of filename :
    // # VID20230807144322.mp4 - (date should be 2023-08-07 14:43:22)
    // # IMG_20241002_171017_879.jpg - (date should be 2024-10-02 17:10:17)
    // # Photo_6553976_DJI_376_jpg_4712359_0_20211161338.jpg - (UNKNOWN)
    // # JPEG_20230813_201133_2141838957444004158.jpg - (UNKNOWN)
    // # IMG-20161225-WA0003.jpg - (date should be 2016-12-25 00:00:00)
    // # photo-2025-04-24T13_36_44.640.jpg - (date should be 2025-04-24 13:36:44)
    // # dji_export_1647685681159.jpg - (date should be 2022-03-19 10:28:41) (EPOCH)
    // # JPEG_20230813_201133_2141838957444004158.jpg
    // # JPEG_20230813_203242_637533839065631336.jpg
    // # Screenshot_2017-04-16-14-54-40-420_com.google.a.png
    // # Screenshot_2019-01-20-18-52-38-051_com.hbwares..png
    // # PANO_20170427_153012.jpg
    // # Photo_6554065_DJI_465_jpg_4048335_0_20215811432.jpg



    static getDateTime(filename: string): Date | null {
        // Try to match various filename patterns for datetime extraction
        const patterns = [

            //  JPEG_20230813_201133_2141838957444004158.jpg'
            // Pattern: JPEG_YYYYMMDD_HHMMSS
            {
                regex: /JPEG_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})_/,
                map: (m: RegExpMatchArray) => Date.UTC(
                    parseInt(m[1]),
                    parseInt(m[2]) - 1,
                    parseInt(m[3]),
                    parseInt(m[4]),
                    parseInt(m[5]),
                    parseInt(m[6])
                )
            },
            // Photo_6554065_DJI_465_jpg_4048335_0_20215811432.jpg
            // Pattern: ..._(YYYY)(MM)(DD)(HH)(MM)(SS)
            {
                regex: /_(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\.jpg$/,
                map: (m: RegExpMatchArray) => Date.UTC(
                    parseInt(m[1]),
                    parseInt(m[2]) - 1,
                    parseInt(m[3]),
                    parseInt(m[4]),
                    parseInt(m[5]),
                    parseInt(m[6])
                )
            },
            // VID20230807144322.mp4
            {
                regex: /VID(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
                map: (m: RegExpMatchArray) => Date.UTC(
                    parseInt(m[1]),
                    parseInt(m[2]) - 1,
                    parseInt(m[3]),
                    parseInt(m[4]),
                    parseInt(m[5]),
                    parseInt(m[6])
                )
            },
            // IMG_20241002_171017_879.jpg, JPEG_20230813_201133_2141838957444004158.jpg
            {
                regex: /IMG_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/,
                map: (m: RegExpMatchArray) => Date.UTC(
                    parseInt(m[1]),
                    parseInt(m[2]) - 1,
                    parseInt(m[3]),
                    parseInt(m[4]),
                    parseInt(m[5]),
                    parseInt(m[6])
                )
            },
            // dji_export_1647685681159.jpg (epoch ms)
            {
                regex: /(\d{13})/, // match 13-digit epoch
                map: (m: RegExpMatchArray) => {
                    const epoch = parseInt(m[1]);
                    const date = new Date(epoch);
                    const now = Date.now();
                    const currentYear = new Date().getUTCFullYear();
                    if (
                        date.getUTCFullYear() >= 2000 &&
                        date.getUTCFullYear() <= currentYear &&
                        epoch <= now
                    ) {
                        return date.getTime();
                    }
                    return NaN;
                }
            },
            // Photo_6553920_DJI_320_jpg_4122634_0_20201251454.jpg
            // Match the last 12-digit or 11-digit block for date
            {
                regex: /(\d{12})\.jpg$/, // match last 12 digits before .jpg
                map: (m: RegExpMatchArray) => {
                    const block = m[1];
                    // YYYYMMDDHHMM
                    const year = parseInt(block.slice(0, 4));
                    const month = parseInt(block.slice(4, 6)) - 1;
                    const day = parseInt(block.slice(6, 8));
                    const hour = parseInt(block.slice(8, 10));
                    const minute = parseInt(block.slice(10, 12));
                    // Plausibility check
                    if (
                        year >= 2000 && year <= 2030 &&
                        month >= 0 && month <= 11 &&
                        day >= 1 && day <= 31 &&
                        hour >= 0 && hour <= 23 &&
                        minute >= 0 && minute <= 59
                    ) {
                        return Date.UTC(year, month, day, hour, minute, 0);
                    }
                    return NaN;
                }
            },
            {
                regex: /(\d{11})\.jpg$/, // match last 11 digits before .jpg
                map: (m: RegExpMatchArray) => {
                    const block = m[1];
                    // YYYYMMDDHHM (treat last digit as hour, minute zero)
                    const year = parseInt(block.slice(0, 4));
                    const month = parseInt(block.slice(4, 6)) - 1;
                    const day = parseInt(block.slice(6, 8));
                    const hour = parseInt(block.slice(8, 10));
                    const minute = 0;
                    // Plausibility check
                    if (
                        year >= 2000 && year <= 2030 &&
                        month >= 0 && month <= 11 &&
                        day >= 1 && day <= 31 &&
                        hour >= 0 && hour <= 23
                    ) {
                        return Date.UTC(year, month, day, hour, minute, 0);
                    }
                    return NaN;
                }
            },
            // IMG-20161225-WA0003.jpg
            {
                regex: /IMG-(\d{4})(\d{2})(\d{2})/,
                map: (m: RegExpMatchArray) => Date.UTC(
                    parseInt(m[1]),
                    parseInt(m[2]) - 1,
                    parseInt(m[3]),
                    0, 0, 0
                )
            },
            // photo-2025-04-24T13_36_44.640.jpg
            {
                regex: /photo-(\d{4})-(\d{2})-(\d{2})T(\d{2})_(\d{2})_(\d{2})/,
                map: (m: RegExpMatchArray) => Date.UTC(
                    parseInt(m[1]),
                    parseInt(m[2]) - 1,
                    parseInt(m[3]),
                    parseInt(m[4]),
                    parseInt(m[5]),
                    parseInt(m[6])
                )
            },
            // dji_export_1647685681159.jpg (epoch ms)
            {
                regex: /(\d{13})/,
                map: (m: RegExpMatchArray) => {
                    // Only treat as epoch if plausible (between 2000 and 2025)
                    const epoch = parseInt(m[1]);
                    const date = new Date(epoch);
                    const now = Date.now();
                    const currentYear = new Date().getUTCFullYear();
                    if (
                        date.getUTCFullYear() >= 2000 &&
                        date.getUTCFullYear() <= currentYear &&
                        epoch <= now
                    ) {
                        return date.getTime();
                    }
                    return NaN;
                }
            },
            // Screenshot_2017-04-16-14-54-40-420_com.google.a.png
            // Screenshot_2019-01-20-18-52-38-051_com.hbwares..png
            // Pattern: Screenshot_YYYY-MM-DD-HH-MM-SS
            {
                regex: /Screenshot_(\d{4})-(\d{2})-(\d{2})-(\d{2})-(\d{2})-(\d{2})/,
                map: (m: RegExpMatchArray) => Date.UTC(
                    parseInt(m[1]),
                    parseInt(m[2]) - 1,
                    parseInt(m[3]),
                    parseInt(m[4]),
                    parseInt(m[5]),
                    parseInt(m[6])
                )
            },
            // PANO_20170427_153012.jpg
            // Pattern: PANO_YYYYMMDD_HHMMSS
            {
                regex: /PANO_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/,
                map: (m: RegExpMatchArray) => Date.UTC(
                    parseInt(m[1]),
                    parseInt(m[2]) - 1,
                    parseInt(m[3]),
                    parseInt(m[4]),
                    parseInt(m[5]),
                    parseInt(m[6])
                )
            },


        ];

        // Check each pattern against the filename
        for (const pattern of patterns) {
            const match = filename.match(pattern.regex);
            if (match) {
                const date = new Date(pattern.map(match));
                if (!isNaN(date.getTime())) {

                    // Always return UTC
                    const datetime = new Date(date.getTime());

                    if (date.getFullYear() < 2000 || date.getFullYear() > 2030)
                        return null;

                    return datetime;
                }
            }
        }

        // If no patterns matched, return null
        return null;
    }

}