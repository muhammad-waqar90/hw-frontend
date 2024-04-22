import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function getRootFaqCategoriesList() {
  return http
    .get(`gu/faqs/categories`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getSubFaqCategoryList(id) {
  return http
    .get(`gu/faqs/categories/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getSearchFaqs(searchText) {
  const params = { searchText };
  return http
    .get(`gu/faqs`, { params })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getFaq(id) {
  return http
    .get(`gu/faqs/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
