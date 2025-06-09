import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useToast } from "./use-toast.ts";
import { RootState } from "../redux/store.ts";
import { ApiResponse, AxiosQueryProps } from "../types/index.ts";
import { useNavigate } from "react-router";
import useApiClient from "./useApiClient.ts";

interface type {
  queryKeys: string[];
  queryProps: AxiosQueryProps
}

export const useResponse = ({ queryKeys, queryProps }: type) => {
  const { _id: userClerkId } = useSelector((state: RootState) => state.auth);

  const { toast } = useToast();
  const navigate = useNavigate();
  const apiClient = useApiClient();

  const result = useQuery({
    queryKey: [...queryKeys],
    queryFn: async () => {
      const response = await apiClient.get(queryProps.uri) as ApiResponse;

      return response?.data ?? null;
    },
    retry: 2,
    retryDelay: 1000,
    enabled: !!userClerkId,
  });


  useEffect(() => {
    const { isError, error } = result;

    if (isError) {
      const axiosError = error as ApiResponse;

      if (axiosError.statusCode === 403) {
        navigate("/sign-in");
      }

      toast({
        title: "Error",
        description: axiosError.message || "An error occurred",
        variant: "destructive",
      });
    }
  }, [navigate, result, toast]);

  return result;
};
