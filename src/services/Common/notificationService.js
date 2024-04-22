import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function getNotificationList() {
  return http
    .get(`iu/notifications/me`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getNotificationListAdmin() {
  return http
    .get(`admins/notifications/me`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function markAllNotificationsAsRead() {
  return http
    .put(`iu/notifications/all/read`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function markAllNotificationsAsReadAdmin() {
  return http
    .put(`admins/notifications/all/read`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function markNotificationAsRead(id) {
  return http
    .put(`notifications/${id}/read`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function markAllGlobalNotificationsAsRead() {
  return { currentUnreadCount: 0 };
}

export function getGlobalNotification(id) {
  return http
    .get(`iu/global-notifications/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function markGlobalNotificationAsRead(id) {
  return http
    .put(`iu/global-notifications/${id}/read`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function markGlobalNotificationsAsModalRead() {
  return http
    .put(`iu/global-notifications/modal/read`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
