import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function getModuleQuiz(courseId, levelId, courseModuleId) {
  return http
    .get(
      `af/courses/${courseId}/levels/${levelId}/modules/${courseModuleId}/quizzes`
    )
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getLessonQuiz(courseId, levelId, courseModuleId, lessonId) {
  return http
    .get(
      `af/courses/${courseId}/levels/${levelId}/modules/${courseModuleId}/lessons/${lessonId}/quizzes`
    )
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
