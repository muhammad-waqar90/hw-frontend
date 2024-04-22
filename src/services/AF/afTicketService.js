import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function getTicketCategories() {
  return http
    .get(`af/tickets/categories`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function createTicketSubject(data) {
  return http
    .post(`af/tickets/subjects`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getTicketSubjectList(searchText, page) {
  const params = { searchText, page };

  return http
    .get(`af/tickets/subjects`, { params })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getTicketSubject(id) {
  return http
    .get(`af/tickets/subjects/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function updateTicketSubject(id, data) {
  return http
    .put(`af/tickets/subjects/${id}`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function deleteTicketSubject(id) {
  return http
    .delete(`af/tickets/subjects/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

/**
 * @param {integer} status
 * @param {integer} category
 * @param {string} subject
 * @param {integer} page
 */
export function getTicketList(
  status = null,
  category = null,
  subject = null,
  page = null
) {
  const params = { status, category, subject, page };
  return http
    .get(`af/tickets`, { params })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

/**
 * @param {integer} status
 * @param {string} subject
 * @param {integer} page
 */
export function getMyTicketList(status = null, subject = null, page = null) {
  const params = { status, subject, page };
  return http
    .get(`af/tickets/me`, { params })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getTicket(id) {
  return http
    .get(`af/tickets/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function updateTicketCategory(id, data) {
  return http
    .put(`af/tickets/${id}/categories`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function claimTicket(id) {
  return http
    .put(`af/tickets/${id}/claim`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function unclaimTicket(id) {
  return http
    .put(`af/tickets/${id}/unclaim`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function onHoldTicket(id) {
  return http
    .put(`af/tickets/${id}/on-hold`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function replyToTicket(id, data) {
  return http
    .post(`af/tickets/${id}/messages`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function resolveTicket(id) {
  return http
    .put(`af/tickets/${id}/resolve`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function saveAsLessonFaq(id) {
  return http
    .post(`af/tickets/${id}/qa`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
