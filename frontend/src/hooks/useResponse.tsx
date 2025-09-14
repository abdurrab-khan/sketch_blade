import { useCallback, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useToast } from "./use-toast.ts";
import { RootState } from "../redux/store.ts";
import { ApiResponse, AxiosQueryProps } from "../types/index.ts";
import useApiClient from "./useApiClient.ts";

interface type {
  queryKeys: string[];
  queryProps: AxiosQueryProps;
}

export const useResponse = <T,>({ queryKeys, queryProps }: type) => {
  const { _id: userClerkId } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();
  const apiClient = useApiClient();

  const memoizedQueryKey = useMemo(() => [...queryKeys], [queryKeys]);
  const queryFn = useCallback(async () => {
    const response = await apiClient.get<ApiResponse<T>>(queryProps.uri);
    return response?.data ?? null;
  }, [apiClient, queryProps.uri]);

  const result = useQuery({
    queryKey: memoizedQueryKey,
    queryFn,
    retry: 3,
    retryDelay: 1000,
    enabled: !!userClerkId,
  });

  const errorMessage = useMemo(() => {
    if (result.isError && result.error) {
      return result.error.message || "An error occurred";
    }
    return null;
  }, [result.isError, result.error]);

  useEffect(() => {
    if (errorMessage) {
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [errorMessage, toast]);

  return result;
};