import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function getAllTicketSubjects() {
  return http
    .get(`gu/tickets/subjects`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getTicketSubject(id) {
  return http
    .get(`gu/tickets/subjects/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function createTicket(data) {
  return http
    .post(`gu/tickets`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
