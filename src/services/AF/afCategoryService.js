import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function getCategoryListDetailed(searchText, page) {
  const params = { searchText, page };

  return http
    .get(`af/categories`, { params })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function createCategory(data) {
  return http
    .post(`af/categories`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getCategory(id) {
  return http
    .get(`af/categories/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function updateCategory(id, data) {
  return http
    .put(`af/categories/${id}`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function deleteCategory(id) {
  return http
    .delete(`af/categories/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getRootCategories() {
  return http
    .get(`af/categories/root`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getChildCategoriesForRootCategory(id) {
  return http
    .get(`af/categories/root/${id}/children`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

//get categories for courses
export function getCourseCategories() {
  return http
    .get(`af/courses/categories/all`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getCategoryList(searchText) {
  const params = { searchText };

  return http
    .get(`af/categories/filter`, { params })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
