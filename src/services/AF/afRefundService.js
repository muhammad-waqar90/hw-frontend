import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export async function refund(userId, items) {
  try {
    const res = await http.post(`af/refunds/users/${userId}`, items);
    return res.data;
  } catch (e) {
    return handleHttpError(e);
  }
}

export async function getRefundedItemsList(page) {
  try {
    const params = { page };
    const res = await http.get(`af/refunds`, { params });
    return res.data;
  } catch (e) {
    return handleHttpError(e);
  }
}
