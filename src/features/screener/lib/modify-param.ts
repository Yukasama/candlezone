export const modifyParam = (
  params: URLSearchParams,
  key: string,
  value: string | number,
  defaultValue: string | number,
) => {
  if (value === defaultValue || value === 'Any') {
    params.delete(key);
  } else {
    params.set(key, value.toString());
  }
};
