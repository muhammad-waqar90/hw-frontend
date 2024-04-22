import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function getSpecificGlobalNotification(id) {
  return http
    .get(`iu/global-notifications/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
