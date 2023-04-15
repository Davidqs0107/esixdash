export const renameKeys = (keysMap: any, object: any) =>
  Object.keys(object).reduce(
    (acc, key) => ({
      ...acc,
      ...{ [keysMap[key] || key]: object[key] },
    }),
    {}
  );

export default renameKeys;
