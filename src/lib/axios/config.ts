import axios from "axios";
import type { AxiosError, AxiosRequestConfig } from "axios";
import { getAccessToken } from "@/stores/auth.store";
import { tokenRefreshService } from "@/lib/token-refresh.service";

const BASE_API_URL = import.meta.env.VITE_API_URL; // MUST be set - no unsafe fallback

if (!BASE_API_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL environment variable is required and must be set to the backend API URL"
  );
}

const axiosClient = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    // Check if token is expiring soon and refresh proactively
    try {
      const refreshResult =
        await tokenRefreshService.refreshTokenIfExpiringSoon(5);
      if (refreshResult) {
        console.log("Token refreshed proactively before request");
      }
    } catch (error) {
      console.warn("Proactive token refresh failed:", error);
    }

    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error: AxiosError) {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    const res = error.response;

    if (res?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokenResponse = await tokenRefreshService.refreshToken();

        if (tokenResponse.jwt && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${tokenResponse.jwt}`;
        }

        return axiosClient(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(error);
      }
    }

    if (res?.status) {
      console.error(
        "Looks like there was a problem. Status Code: " + res.status
      );
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
