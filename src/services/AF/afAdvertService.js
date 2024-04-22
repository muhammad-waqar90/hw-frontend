import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function getAdvertList(searchText, status, page) {
  const params = { searchText, status, page };

  return http
    .get(`af/adverts`, { params })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function createAdvert(data) {
  return http
    .post(`af/adverts`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getAdvert(id) {
  return http
    .get(`af/adverts/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function updateAdvert(id, data) {
  return http
    .post(`af/adverts/${id}`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function deleteAdvert(id) {
  return http
    .delete(`af/adverts/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function sortAdvert(data) {
  return http
    .post(`af/adverts/sort`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
