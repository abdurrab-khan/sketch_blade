import Axios, { AxiosResponse } from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { ApiResponse } from "@/types";

const apiClient = Axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1/",
  timeout: 10000,
  withCredentials: true,
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
        config.headers["Content-Type"] = "application/json";

        return config;
      },
      function (error) {
        return Promise.reject(error);
      },
    );

    apiClient.interceptors.response.use(
      (response: ApiResponse<any, any>) => {
        console.log("Success:- ", response.data);
        const customResponse: ApiResponse = {
          success: response.data?.success,
          statusCode: response.data?.statusCode || response.status,
          message: response.data?.message || "Request successful",
          data: response.data?.data || response.data,
        };

        return Promise.resolve(customResponse);
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
