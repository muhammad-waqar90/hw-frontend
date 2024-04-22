import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function getCourseWithAvailableEbooks(courseId, levelValue) {
  return http
    .get(`iu/courses/${courseId}/level/${levelValue}/ebooks`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
