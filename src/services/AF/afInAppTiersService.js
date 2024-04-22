import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function getInAppTiers() {
  return http
    .get(`af/tiers/all`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
