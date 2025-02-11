import Papa from 'papaparse';

export const parseData = <T>(raw: string) => {
  return Papa.parse<T>(raw, {
    dynamicTyping: true,
    header: true,
    skipEmptyLines: true,
  }).data;
};
