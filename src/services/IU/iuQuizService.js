import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function getLessonQuizService(courseId, lessonId) {
  return http
    .get(`iu/courses/${courseId}/lessons/${lessonId}/quiz`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getPreviousLessonQuizService(courseId, lessonId) {
  return http
    .get(`iu/courses/${courseId}/lessons/${lessonId}/quiz/attempt`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function submitLessonQuizService(courseId, lessonId, data) {
  return http
    .post(`iu/courses/${courseId}/lessons/${lessonId}/quiz`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getModuleQuizService(courseId, courseModuleId) {
  return http
    .get(`iu/courses/${courseId}/course-modules/${courseModuleId}/quiz`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getPreviousModuleQuizService(courseId, courseModuleId) {
  return http
    .get(`iu/courses/${courseId}/course-modules/${courseModuleId}/quiz/attempt`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function submitModuleQuizService(courseId, courseModuleId, data) {
  return http
    .post(`iu/courses/${courseId}/course-modules/${courseModuleId}/quiz`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getLevelQuizService(courseId, courseLevelId) {
  return http
    .get(`iu/courses/${courseId}/course-levels/${courseLevelId}/quiz`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getPreviousLevelQuizService(courseId, courseLevelId) {
  return http
    .get(`iu/courses/${courseId}/course-levels/${courseLevelId}/quiz/attempt`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function submitLevelQuizService(courseId, courseLevelId, data) {
  return http
    .post(`iu/courses/${courseId}/course-levels/${courseLevelId}/quiz`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getCourseModuleQuizAccess(courseId, courseModuleId) {
  return http
    .get(`iu/courses/${courseId}/course-modules/${courseModuleId}/quiz/access`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
