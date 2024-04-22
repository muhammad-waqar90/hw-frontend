import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function getProductsList(searchText, page) {
  const params = { searchText, page };

  return http
    .get(`af/products`, { params })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function updateProduct(id, data) {
  return http
    .post(`af/products/${id}`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function createProduct(data) {
  return http
    .post(`af/products`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getProduct(id) {
  return http
    .get(`af/products/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function deleteProduct(id) {
  return http
    .delete(`af/products/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getUnboundedBooks(searchText) {
  const params = { searchText };

  return http
    .get(`af/courses/unboundedBooks/filter`, { params })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
