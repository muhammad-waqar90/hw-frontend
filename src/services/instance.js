import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

const refreshAuthLogic = (failedRequest) =>
  instance.post("/auth/refresh").then((tokenRefreshResponse) => {
    localStorage.setItem(
      "token",
      "Bearer " + tokenRefreshResponse.data.access_token
    );
    failedRequest.response.config.headers["Authorization"] =
      "Bearer " + tokenRefreshResponse.data.access_token;
    return Promise.resolve();
  });

function getAccessToken() {
  return localStorage.getItem("token");
}

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 30000,
});

instance.interceptors.request.use((request) => {
  request.headers["Authorization"] = `${getAccessToken()}`;
  return request;
});

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (
      error &&
      error.response &&
      error.response.status == 401 &&
      error.config.url.indexOf("/auth/refresh") === 0
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      location.reload();
    }
    return Promise.reject(error);
  }
);

createAuthRefreshInterceptor(instance, refreshAuthLogic);

export default instance;

/* import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 30000
});
const token = localStorage.getItem('token');
if (token)
  instance.defaults.headers.common['Authorization'] = localStorage.getItem('token');

export default instance; */
