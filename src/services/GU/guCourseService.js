import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function getCourseService(id) {
  return http
    .get("/gu/courses/" + id)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getCourseLevelService(courseId, level) {
  return http
    .get(`/gu/courses/${courseId}/level/${level}`)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getCourseWithAvailableEbooks(courseId, levelValue) {
  return http
    .get(`gu/courses/${courseId}/level/${levelValue}/ebooks`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
