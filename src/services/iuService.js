import http from "./instance";
import { handleHttpError } from "./httpHelpers";

/*
|--------------------------------------------------------------------------
| Guest Cart section
|--------------------------------------------------------------------------
*/

export function getGuestCartService(cartId) {
  return http
    .get(`/gu/guest-carts/guest-cart/${cartId}`)
    .then((response) => {
      return response.data["guest-cart"];
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function fetchGuestCartItems(items) {
  return http
    .post(`/gu/guest-carts/map-cart-items/`, { items: items })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function clearGuestCart(cartId) {
  return http
    .delete(`/gu/guest-carts/${cartId}`)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      handleHttpError(e);
    });
}

/*
|--------------------------------------------------------------------------
| Product section
|--------------------------------------------------------------------------
*/

export function getTopProductsService(searchText) {
  const params = { searchText };
  return http
    .get("/iu/products/top-books", { params })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getAvailableProductsService(searchText) {
  const params = { searchText };
  return http
    .get("/iu/products/available-books", { params })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getProductService(id) {
  const params = { product_id: id };
  return http
    .get("/iu/products/single-book", { params })
    .then((response) => {
      return response.data["book"];
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

/*
|--------------------------------------------------------------------------
| Course section
|--------------------------------------------------------------------------
*/

export function getAvailableCoursesService(searchText) {
  const params = { searchText };
  return http
    .get("/iu/courses/available", { params })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getTopCoursesService(searchText) {
  const params = { searchText, order: "popularity", orderDirection: "DESC" };
  return http
    .get("/iu/courses/available", { params })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getComingSoonCoursesService() {
  const params = { order: "createdDate", orderDirection: "DESC" };
  return http
    .get("/iu/courses/coming-soon", { params })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getOwnedCoursesService() {
  return http
    .get("/iu/courses/owned")
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getDashboard() {
  return http
    .get("/iu/courses/dashboard")
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getEvents(from, to) {
  const params = { from: from, to: to };

  return http
    .get("/iu/events", { params })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getEvent(id) {
  return http
    .get(`/iu/events/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getCourseService(id) {
  return http
    .get("/iu/courses/" + id)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getCourseLevelService(courseId, level) {
  return http
    .get(`/iu/courses/${courseId}/level/${level}`)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getCourseLessonService(courseId, lessonId) {
  return http
    .get(`/iu/courses/${courseId}/lessons/${lessonId}`)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getLessonNoteService(courseId, lessonId) {
  return http
    .get(`/iu/courses/${courseId}/lessons/${lessonId}/note`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function updateLessonNoteService(courseId, lessonId, text) {
  return http
    .post(`iu/courses/${courseId}/lessons/${lessonId}/note`, text)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function saveLessonVideoProgressService(courseId, lessonId, data) {
  return http
    .post(`iu/courses/${courseId}/lessons/${lessonId}/video`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getLessonEbookService(courseId, lessonId) {
  return http
    .get(`/iu/courses/${courseId}/lessons/${lessonId}/ebooks`)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function dismissLessonEbookService(courseId, lessonId) {
  return http
    .post(`/iu/courses/${courseId}/lessons/${lessonId}/ebooks/dismiss`)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getOngoingLessons(courseId, progress = null) {
  const params = { progress };

  return http
    .get(`/iu/courses/${courseId}/lessons/ongoing`, { params })
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getCourseModuleLessons(courseId, courseModuleId) {
  return http
    .get(`iu/courses/${courseId}/course-modules/${courseModuleId}/lessons`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getCouponRedeemItems(cartObject) {
  return http
    .post(`iu/coupons/redeem/can`, cartObject)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

/*
|--------------------------------------------------------------------------
| Profile section
|--------------------------------------------------------------------------
*/

export function getProfileService() {
  return http
    .get(`iu/profile/me`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

//export function updateProfileService (data, callback) {
export function updateProfileService(data) {
  /*   const config = {
    onUploadProgress: function (progressEvent) {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      callback(percentCompleted);
    }
  } */

  //return http.post(`iu/profile/me`, data, config).then( res => {
  return http
    .post(`iu/profile/me`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getIdentity() {
  return http
    .get(`/iu/profile/identity`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function updateIdentity(data) {
  return http
    .post(`/iu/profile/identity`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getLessonQA(courseId, lessonId) {
  return http
    .get(`/iu/courses/${courseId}/lessons/${lessonId}/qas/me/latest`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function submitLessonQA(courseId, lessonId, data) {
  return http
    .post(`/iu/courses/${courseId}/lessons/${lessonId}/qas`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function getLessonQAList(courseId, lessonId) {
  return http
    .get(`/iu/courses/${courseId}/lessons/${lessonId}/qas/me`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

/*
|--------------------------------------------------------------------------
| Salary Scale section
|--------------------------------------------------------------------------
*/

export function getDiscountedCountryList() {
  return http
    .get(`/iu/salary-scales/discounted-countries`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function createSalaryScale(payload) {
  return http
    .post(`/iu/salary-scales`, payload)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function updateSalaryScale(payload) {
  return http
    .put(`/iu/salary-scales`, payload)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}

export function enableSalaryScale(payload) {
  return http
    .put(`/iu/profile/salary-scale/update-flag`, payload)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return handleHttpError(e);
    });
}
