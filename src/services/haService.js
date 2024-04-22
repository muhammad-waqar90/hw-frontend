import http from "./instance";
import { handleHttpError } from "./httpHelpers";

export function getAdminList(searchText, page) {
  const params = { searchText, page };
  return http
    .get("/ha/admins", { params })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getAllAdmins(searchText) {
  const params = { searchText };
  return http
    .get("/ha/admins/all", { params })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function createAdmin(data) {
  return http
    .post("/ha/admins", data)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getPermissionList(searchText, page = "") {
  const params = { searchText, page };
  return http
    .get("/ha/permissions", { params })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getPermGroupList(searchText, page) {
  const params = { searchText, page };
  return http
    .get("/ha/permissions/groups", { params })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getPermGroup(id) {
  return http
    .get(`/ha/permissions/groups/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function createPermGroup(data) {
  return http
    .post("/ha/permissions/groups", data)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function updatePermGroup(id, data) {
  return http
    .put(`/ha/permissions/groups/${id}`, data)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function deletePermGroup(id) {
  return http
    .delete(`/ha/permissions/groups/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getAdmin(id) {
  return http
    .get(`/ha/admins/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function updateAdmin(id, data) {
  return http
    .put(`/ha/admins/${id}`, data)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function deleteAdmin(id) {
  return http
    .delete(`/ha/admins/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function activateAdmin(id) {
  return http
    .put(`/ha/admins/${id}/activate`)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function deactivateAdmin(id) {
  return http
    .put(`/ha/admins/${id}/deactivate`)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
