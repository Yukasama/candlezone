export const modifyParam = (
  params: URLSearchParams,
  key: string,
  value: number | string,
  defaultValue: number | string,
) => {
  if (value === defaultValue || value === 'Any') {
    params.delete(key);
  } else {
    params.set(key, value.toString());
  }
};
