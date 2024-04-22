import { isEqual } from "lodash";

export const isSameRoute = (
  fromName,
  fromParam,
  fromQuery,
  fromHash,
  toName,
  toParam,
  toQuery,
  toHash
) => {
  return (
    fromName == toName &&
    fromHash == toHash &&
    isEqual(fromQuery, toQuery) &&
    isEqual(fromParam, toParam)
  );
};
