import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function getPurchaseHistory(page) {
  const params = { page };

  return http
    .get(`iu/purchases/history`, { params })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function cartCheckout(data) {
  return http
    .post(`iu/purchases/cart/checkout`, data, { timeout: 60000 })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
