import http from "./instance";
import { handleHttpError } from "./httpHelpers";

export function getNextPage(page) {
  return http
    .get(page)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
