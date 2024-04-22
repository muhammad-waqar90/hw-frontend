import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function getRootFaqCategoriesList() {
  return http
    .get(`iu/faqs/categories`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getSubFaqCategoryList(id) {
  return http
    .get(`iu/faqs/categories/${id}`)
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
    .get(`iu/faqs`, { params })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getFaq(id) {
  return http
    .get(`iu/faqs/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
