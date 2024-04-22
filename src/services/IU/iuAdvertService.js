import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function getAdvertList() {
  return http
    .get(`iu/adverts`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
