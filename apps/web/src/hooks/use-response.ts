import { useCallback, useEffect, useMemo } from "react";
import {
  QueryKey,
  UndefinedInitialDataOptions,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useToast } from "./use-toast.ts";
import { RootState } from "../redux/store.ts";
import { ApiResponse, AxiosQueryProps } from "../types/index.ts";
import useApiClient from "./use-api-client.ts";

interface UseResponseParams<T> {
  queryKey: QueryKey;
  queryProps: AxiosQueryProps;
  queryOptions?: Partial<
    UndefinedInitialDataOptions<ApiResponse<T>, Error, ApiResponse<T>, QueryKey>
  >;
}

const useResponse = <T>({
  queryKey,
  queryProps,
  queryOptions,
}: UseResponseParams<T>): UseQueryResult<ApiResponse<T>, Error> => {
  const { _id: userClerkId } = useSelector((state: RootState) => state.auth);
  const { toast, dismiss } = useToast();
  const apiClient = useApiClient();

  const memoizedQueryKey = useMemo<QueryKey>(() => [...queryKey], [queryKey]); // Memoize query keys.

  const queryFn = useCallback(async (): Promise<ApiResponse<T>> => {
    const response = await apiClient.get<ApiResponse<T>>(queryProps.uri);

    if (!response?.data) {
      throw new Error("No data received from API");
    }

    return response.data;
  }, [apiClient, queryProps.uri]);

  const result = useQuery<ApiResponse<T>, Error, ApiResponse<T>, QueryKey>({
    queryKey: memoizedQueryKey,
    queryFn: queryFn,
    retry: 3,
    retryDelay: 1000,
    enabled: !!userClerkId,
    refetchOnReconnect: true,
    ...queryOptions,
  });

  const errorMessage =
    result.isError && result.error ? result.error.message || "An error occurred" : null;

  useEffect(() => {
    let toastId = "";
    if (errorMessage) {
      toastId = toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      }).id;
    }
    return () => {
      if (toastId) {
        dismiss(toastId);
      }
    };
  }, [dismiss, errorMessage, toast]);

  return result;
};

export default useResponse;
