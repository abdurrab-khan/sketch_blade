import Axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";

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

        console.log("Token ", token);

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
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          const token = await getToken();
          if (token) {
            error.config.headers.Authorization = `Bearer ${token}`;
            return apiClient.request(error.config);
          }
        }
        return Promise.reject(error);
      },
    );
  }, [getToken]);

  return apiClient;
}
