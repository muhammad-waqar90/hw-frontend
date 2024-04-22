import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function getLessonFaqList(lessonId, searchText) {
  const params = { searchText };

  return http
    .get(`af/lesson-faqs/${lessonId}`, { params })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function createLessonFaq(data) {
  return http
    .post(`af/lesson-faqs`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function updateLessonFaq(id, data) {
  return http
    .put(`af/lesson-faqs/${id}`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function deleteLessonFaq(id) {
  return http
    .delete(`af/lesson-faqs/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
