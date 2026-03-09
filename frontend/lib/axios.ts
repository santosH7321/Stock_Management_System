import axios, { AxiosError } from "axios";

const DEFAULT_API_ORIGIN = "http://localhost:8080";

const resolveApiBaseUrl = () => {
  const rawBaseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    DEFAULT_API_ORIGIN;

  const normalizedBase = rawBaseUrl.trim().replace(/\/+$/, "");
  return normalizedBase.endsWith("/api")
    ? normalizedBase
    : `${normalizedBase}/api`;
};

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const requestUrl = error.config?.url || "";
        const isLoginRequest = requestUrl.includes("/auth/login");
        const isOnLoginPage = window.location.pathname === "/login";

        if (!isLoginRequest && !isOnLoginPage) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
