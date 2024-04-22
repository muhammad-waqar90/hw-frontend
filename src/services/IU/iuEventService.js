import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function get(from, to, type = null) {
  const params = { from, to, type };
  return http
    .get(`iu/events`, { params })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
