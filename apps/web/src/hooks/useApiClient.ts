import Axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { ApiResponse } from "@/types";

const apiClient = Axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default function useApiClient() {
  const { getToken } = useAuth();

  useEffect(() => {
    apiClient.interceptors.request.use(
      async function (config) {
        const token = await getToken();

        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
          config.headers["Access-Control-Allow-Credentials"] = true;
        }

        return config;
      },
      function (error) {
        return Promise.reject(error);
      },
    );

    apiClient.interceptors.response.use(
      (response) => {
        const customResponse = {
          success: response.data?.success,
          statusCode: response.data?.statusCode || response.status,
          message: response?.data?.message || "",
          data: response.data?.data || response.data,
        };

        response.data = customResponse;
        return response;
      },
      async (error) => {
        if (error.response?.status === 401) {
          const token = await getToken();

          if (token) {
            error.config.headers.Authorization = `Bearer ${token}`;
            return apiClient.request(error.config);
          }
        }

        const errorResponse: ApiResponse = {
          success: false,
          statusCode: error.response?.status || 500,
          message: error.response?.data?.message || error.message,
          data: error.response?.data?.data || null,
        };

        return Promise.reject(errorResponse);
      },
    );
  }, [getToken]);

  return apiClient;
}
