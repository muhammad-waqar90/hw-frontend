import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function getEventsList(searchText, type, page) {
  const params = { searchText, type, page };

  return http
    .get(`af/events`, { params })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function createEvent(data) {
  return http
    .post(`af/events`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getEvent(id) {
  return http
    .get(`af/events/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function updateEvent(id, data) {
  return http
    .post(`af/events/${id}`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function deleteEvent(id) {
  return http
    .delete(`af/events/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
