import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function createLevel(courseId) {
  return http
    .post(`af/courses/${courseId}/levels`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function updateLevel(courseId, levelId, name) {
  return http
    .put(`af/courses/${courseId}/levels/${levelId}`, { name })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function deleteLevel(courseId, levelId) {
  return http
    .delete(`af/courses/${courseId}/levels/${levelId}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
