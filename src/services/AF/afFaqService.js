import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function getFaqCategoriesList(searchText, type, page) {
  const params = { searchText, type, page };

  return http
    .get(`af/faqs/categories`, { params })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getRootFaqCategoriesList() {
  return http
    .get(`af/faqs/categories/root`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function createFaqCategory(data) {
  return http
    .post(`af/faqs/categories`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getFaqCategory(id) {
  return http
    .get(`af/faqs/categories/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function updateFaqCategory(id, data) {
  return http
    .put(`af/faqs/categories/${id}`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function deleteFaqCategory(id) {
  return http
    .delete(`af/faqs/categories/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function publishFaqCategory(id) {
  return http
    .put(`af/faqs/categories/${id}/publish`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function unpublishFaqCategory(id) {
  return http
    .put(`af/faqs/categories/${id}/unpublish`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getFaqsList(searchText, page) {
  const params = { searchText, page };

  return http
    .get(`af/faqs`, { params })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function deleteFaq(id) {
  return http
    .delete(`af/faqs/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function publishFaq(id) {
  return http
    .put(`af/faqs/${id}/publish`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function unpublishFaq(id) {
  return http
    .put(`af/faqs/${id}/unpublish`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function createFaq(data) {
  return http
    .post(`af/faqs`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getFaq(id) {
  return http
    .get(`af/faqs/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function updateFaq(id, data) {
  return http
    .put(`af/faqs/${id}`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getFaqSubCategoriesList() {
  return http
    .get(`af/faqs/categories/sub`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
