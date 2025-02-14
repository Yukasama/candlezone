import Papa from 'papaparse';

export const parseData = <T>(raw: string) => {
  return Papa.parse<T>(raw, {
    dynamicTyping: true,
    header: true,
    skipEmptyLines: true,
  }).data;
};

export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};
