export const modifyParam = (
  params: URLSearchParams,
  paramName: string,
  value: string | number | undefined,
  defaultValue: string | number | undefined,
) => {
  if (value === defaultValue || value === undefined || value === 'Any') {
    params.delete(paramName);
  } else {
    params.set(paramName, value.toString());
  }
};
