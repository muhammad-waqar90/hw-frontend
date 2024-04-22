import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function importCourseQuizzes(courseId, data) {
  return http
    .post(`af/courses/${courseId}/bulk/quizzes`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getImportCourseQuizzes(courseId, page) {
  const params = { page };

  return http
    .get(`af/courses/${courseId}/bulk/quizzes`, { params })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function importLessonQuiz(
  courseId,
  levelId,
  courseModuleId,
  lessonId,
  data
) {
  return http
    .post(
      `af/courses/${courseId}/levels/${levelId}/modules/${courseModuleId}/lessons/${lessonId}/quizzes/bulk`,
      data
    )
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getImportLessonQuizzes(
  courseId,
  levelId,
  courseModuleId,
  lessonId
) {
  return http
    .get(
      `af/courses/${courseId}/levels/${levelId}/modules/${courseModuleId}/lessons/${lessonId}/quizzes/bulk`
    )
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function importModuleQuiz(courseId, levelId, courseModuleId, data) {
  return http
    .post(
      `af/courses/${courseId}/levels/${levelId}/modules/${courseModuleId}/quizzes/bulk`,
      data
    )
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getImportModuleQuizzes(courseId, levelId, courseModuleId) {
  return http
    .get(
      `af/courses/${courseId}/levels/${levelId}/modules/${courseModuleId}/quizzes/bulk`
    )
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
