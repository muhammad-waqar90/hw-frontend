import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function getCouponList(searchText, page = null) {
  const params = { searchText, page };

  return http
    .get(`af/coupons`, { params })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function createCoupon(data) {
  return http
    .post(`af/coupons`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getCoupon(id) {
  return http
    .get(`af/coupons/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function updateCoupon(id, data) {
  return http
    .put(`af/coupons/${id}`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
