import http from "../instance";
import { handleDetailedHttpError } from "../httpHelpers";

export function uploadPhoto(data) {
  return http
    .post(`iu/photo-verification`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleDetailedHttpError(e);
    });
}
