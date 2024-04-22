import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function getCertificateList(page = 1) {
  const params = { page };

  return http
    .get(`iu/certificates`, { params })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getCertificate(id) {
  return http
    .get(`iu/certificates/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function downloadCertificate(id) {
  return http
    .get(`iu/certificates/${id}/download`, {
      responseType: "blob",
    })
    .then((response) => {
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
      link.remove();
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
