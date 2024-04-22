import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function getAllTicketSubjects() {
  return http
    .get(`iu/tickets/subjects`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getTicketSubject(id) {
  return http
    .get(`iu/tickets/subjects/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function createTicket(data) {
  return http
    .post(`iu/tickets`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getTicket(id) {
  return http
    .get(`iu/tickets/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getMyTicketList(status = null, subject = null) {
  const params = { status, subject };
  return http
    .get(`iu/tickets/me`, { params })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function replyToTicket(id, data) {
  return http
    .post(`iu/tickets/${id}/messages`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function resolveTicket(id) {
  return http
    .put(`iu/tickets/${id}/resolve`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function reopenTicket(id) {
  return http
    .put(`iu/tickets/${id}/reopen`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
