import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function getLessonEbook(courseId, levelId, courseModuleId, lessonId) {
  return http
    .get(
      `af/courses/${courseId}/levels/${levelId}/modules/${courseModuleId}/lessons/${lessonId}/ebook`
    )
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function createLessonEbook(
  courseId,
  levelId,
  courseModuleId,
  lessonId,
  data
) {
  return http
    .post(
      `af/courses/${courseId}/levels/${levelId}/modules/${courseModuleId}/lessons/${lessonId}/ebook`,
      data
    )
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function updateLessonEbook(
  courseId,
  levelId,
  courseModuleId,
  lessonId,
  ebookId,
  data
) {
  return http
    .post(
      `af/courses/${courseId}/levels/${levelId}/modules/${courseModuleId}/lessons/${lessonId}/ebook/${ebookId}`,
      data
    )
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function deleteLessonEbook(
  courseId,
  levelId,
  courseModuleId,
  lessonId,
  ebookId
) {
  return http
    .delete(
      `af/courses/${courseId}/levels/${levelId}/modules/${courseModuleId}/lessons/${lessonId}/ebook/${ebookId}`
    )
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
