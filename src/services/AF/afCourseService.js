import http from "../instance";
import { handleHttpError } from "../httpHelpers";

export function getCoursesList(searchText, page) {
  const params = { searchText, page };

  return http
    .get(`af/courses`, { params })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function createCourse(data) {
  return http
    .post(`af/courses`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getCourse(id) {
  return http
    .get(`af/courses/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function updateCourse(id, data) {
  return http
    .post(`af/courses/${id}`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function deleteCourse(id) {
  return http
    .delete(`af/courses/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getNoQuizLessons(id) {
  return http
    .get(`af/courses/${id}/no-quiz-lessons`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function validateCourse(id) {
  return http
    .get(`af/courses/${id}/validate`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function draftCourse(id) {
  return http
    .put(`af/courses/${id}/status/draft`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function publishCourse(id) {
  return http
    .put(`af/courses/${id}/status/publish`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function unpublishCourse(id) {
  return http
    .put(`af/courses/${id}/status/unpublish`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function markCourseAsComingSoon(id) {
  return http
    .put(`af/courses/${id}/status/coming-soon`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getCoursesForFilter(searchText) {
  const params = { searchText };

  return http
    .get(`af/courses/filter`, { params })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getCourseForFilter(id) {
  return http
    .get(`af/courses/filter/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
