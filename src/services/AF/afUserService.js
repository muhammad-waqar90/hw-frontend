import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function getUsersList(searchText, courseId, activeStatus, page) {
  const params = { searchText, courseId, activeStatus, page };

  return http
    .get(`af/users`, { params })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getUserInfo(id) {
  return http
    .get(`af/users/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getUserCourses(id, page, searchText = null) {
  const params = { page, searchText };

  return http
    .get(`af/users/${id}/courses`, { params })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getUserPurchaseHistory(
  id,
  page,
  searchId = null,
  searchText = null,
  type = null,
  priceFrom = null,
  priceTo = null,
  dateFrom = null,
  dateTo = null
) {
  const params = {
    page,
    searchId,
    searchText,
    type,
    priceFrom,
    priceTo,
    dateFrom,
    dateTo,
  };

  return http
    .get(`af/users/${id}/purchases`, { params })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getUserUnselectedEbooks(id, items) {
  return http
    .get(`af/users/${id}/purchases/unselectedEbooks/${items}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function enableUser(id) {
  return http
    .put(`af/users/${id}/enable`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function disableUser(id) {
  return http
    .put(`af/users/${id}/disable`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function deleteUser(id) {
  return http
    .delete(`af/users/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function exportGDPR(id) {
  return http
    .post(`af/users/${id}/gdpr/export`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
