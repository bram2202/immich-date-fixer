import { datetimeExtractor } from '../src/helpers/datetimeExtractor';

describe('DateTimeExtractor', () => {

  const dateCases: Array<[string, string]> = [
    ['VID20230807144322.mp4', '2023-08-07T14:43:22.000Z'],
    ['IMG_20241002_171017_879.jpg', '2024-10-02T17:10:17.000Z'],
    ['IMG-20161225-WA0003.jpg', '2016-12-25T00:00:00.000Z'],
    ['photo-2025-04-24T13_36_44.640.jpg', '2025-04-24T13:36:44.000Z'],
    ['dji_export_1647685681159.jpg', '2022-03-19T10:28:01.159Z'],
    ['Screenshot_2017-04-16-14-54-40-420_com.google.a.png', '2017-04-16T14:54:40.000Z'],
    ['Screenshot_2019-01-20-18-52-38-051_com.hbwares..png', '2019-01-20T18:52:38.000Z'],
    ['PANO_20170427_153012.jpg', '2017-04-27T15:30:12.000Z'],
    ['JPEG_20230813_201133_2141838957444004158.jpg', '2023-08-13T20:11:33.000Z'],
    ['dji_export_1577836800000.jpg', '2020-01-01T00:00:00.000Z'],
    ['Photo_6553920_DJI_320_jpg_4122634_0_20201251454.jpg', '2020-12-05T14:54:00.000Z'],    
  ];

  const nullCases: Array<string> = [
    'randomfile.txt',
  ];


  dateCases.forEach(([filename, expected]) => {
    it(`should extract date from '${filename}'`, () => {
      const result = datetimeExtractor.getDateTime(filename);
      expect(result?.toISOString()).toBe(expected);
    });
  });


  nullCases.forEach((filename) => {
    it(`should return null for '${filename}'`, () => {
      const result = datetimeExtractor.getDateTime(filename);
      expect(result).toBeNull();
    });
  });
});
