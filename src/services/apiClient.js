import axios from "axios";

const apiClient = axios.create({
  baseURL: 'https://logefserver.vercel.app:1338/api',
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((request) => {
  const accessToken = sessionStorage.getItem("accessToken");
  const refreshToken = sessionStorage.getItem("refreshToken");

  if (accessToken) {
    request.headers.common.Authorization = `Bearer ${accessToken}`;
  }
  request.Cookie = `refreshToken=${refreshToken}`;

  return request;
});

apiClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    let res = error.response;
    if (res.status === 401 || res.status === 403) {
      window.location.href = `${process.env.REACT_APP_CLIENT_URL}/#/login?expired=true`;
      sessionStorage.clear();
    }

    return Promise.reject(error.response.data);
  }
);

export default apiClient;
