import http from "./instance";
import { handleHttpError } from "./httpHelpers";

export function getHaList(searchText, page) {
  const params = { searchText, page };
  return http
    .get("/ma/ha", { params })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function deleteHa(id) {
  return http
    .delete(`/ma/ha/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
