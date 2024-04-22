import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function getGlobalNotificationsList(searchText, archiveStatus, page) {
  const params = { searchText, archiveStatus, page };

  return http
    .get(`af/global-notifications`, { params })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function createGlobalNotification(data) {
  return http
    .post(`af/global-notifications`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getGlobalNotification(id) {
  return http
    .get(`af/global-notifications/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function updateGlobalNotification(id, data) {
  return http
    .put(`af/global-notifications/${id}`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function deleteGlobalNotification(id) {
  return http
    .delete(`af/global-notifications/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
