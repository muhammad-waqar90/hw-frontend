import http from "./instance";
import { handleHttpError } from "./httpHelpers";

export function loginService(data) {
  return http
    .post("/auth/login", data, { skipAuthRefresh: true })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function registerService(data) {
  return http
    .post("/auth/register", data, { skipAuthRefresh: true })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
//TODO: delete after new token refresh system seems stable
export function refreshTokenService() {
  return http
    .post("/auth/refresh", { skipAuthRefresh: true })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function logoutService() {
  return http
    .post("/auth/logout", null, { skipAuthRefresh: true })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getUserDataService() {
  return http
    .get("/auth/me")
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function validateEmailService(data) {
  return http
    .post("/auth/verify", data, { skipAuthRefresh: true })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function validateAgeService(data) {
  return http
    .post("/auth/verify-age", data, { skipAuthRefresh: true })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function checkPasswordResetService(data) {
  return http
    .post("/auth/password-reset/check", data, { skipAuthRefresh: true })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function passwordResetService(data) {
  return http
    .put("/auth/password-reset", data, { skipAuthRefresh: true })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function resendVerificationCode(data) {
  return http
    .post("/auth/verify/resend", data, { skipAuthRefresh: true })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function resendParentVerificationCode(data) {
  return http
    .post("/auth/verify/parent/resend", data, { skipAuthRefresh: true })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function requestForgotUsernameService(data) {
  return http
    .post("/auth/username/forgot/request", data, { skipAuthRefresh: true })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function requestPasswordResetService(data) {
  return http
    .post("/auth/password-reset/request", data, { skipAuthRefresh: true })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function deleteUserService(data) {
  //we can only use payload for delete endpoint as config with data {data}
  return http
    .delete("/iu/me", { data })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function accountRestoreService(data) {
  return http
    .post("/auth/restore", data)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function resetUserPasswordService(data) {
  return http
    .put("/iu/change-password", data)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

//TODO: delete after new token refresh system seems stable
export function reInitHttpHeader(token = null) {
  if (token) return (http.defaults.headers.common["Authorization"] = token);

  return delete http.defaults.headers.common["Authorization"];
}
