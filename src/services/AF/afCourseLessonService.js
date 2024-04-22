import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function createLesson(courseId, levelId, moduleId, data) {
  return http
    .post(
      `af/courses/${courseId}/levels/${levelId}/modules/${moduleId}/lessons`,
      data
    )
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function updateLesson(courseId, levelId, moduleId, lessonId, data) {
  return http
    .post(
      `af/courses/${courseId}/levels/${levelId}/modules/${moduleId}/lessons/${lessonId}`,
      data
    )
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function deleteLesson(courseId, levelId, moduleId, lessonId) {
  return http
    .delete(
      `af/courses/${courseId}/levels/${levelId}/modules/${moduleId}/lessons/${lessonId}`
    )
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function sortLessons(courseId, levelId, moduleId, lessons) {
  return http
    .put(
      `af/courses/${courseId}/levels/${levelId}/modules/${moduleId}/lessons/sort`,
      lessons
    )
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
