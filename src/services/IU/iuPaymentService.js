import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function getSetupIntent() {
  return http
    .get(`iu/payments/setup`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getPaymentMethod() {
  return http
    .get(`iu/payments`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function updatePaymentMethod(paymentMethod) {
  return http
    .post(`iu/payments`, { paymentMethod })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function deletePaymentMethods() {
  return http
    .delete(`iu/payments`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
