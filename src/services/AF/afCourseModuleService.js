import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function createModule(courseId, levelId, data) {
  return http
    .post(`af/courses/${courseId}/levels/${levelId}/modules`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function updateModule(courseId, levelId, moduleId, data) {
  return http
    .post(`af/courses/${courseId}/levels/${levelId}/modules/${moduleId}`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function deleteModule(courseId, levelId, moduleId) {
  return http
    .delete(`af/courses/${courseId}/levels/${levelId}/modules/${moduleId}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function sortModule(courseId, levelId, modules) {
  return http
    .put(`af/courses/${courseId}/levels/${levelId}/modules/sort`, modules)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
