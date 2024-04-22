import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function updateCourseDiscounts(data) {
  return http
    .put("af/courses/salary-scale-discounts", data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      handleHttpError(e);
    });
}
