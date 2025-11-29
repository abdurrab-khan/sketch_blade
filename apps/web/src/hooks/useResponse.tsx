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
import useApiClient from "./useApiClient.ts";

interface UseResponseParams<T> {
  queryKeys: QueryKey;
  queryProps: AxiosQueryProps;
  queryOptions?: Partial<
    UndefinedInitialDataOptions<ApiResponse<T>, Error, ApiResponse<T>, QueryKey>
  >;
}

const useResponse = <T,>({
  queryKeys,
  queryProps,
  queryOptions,
}: UseResponseParams<T>): UseQueryResult<ApiResponse<T>, Error> => {
  const { _id: userClerkId } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();
  const apiClient = useApiClient();

  const memoizedQueryKey = useMemo<QueryKey>(() => [...queryKeys], [queryKeys]); // Memoize query keys.

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

export default useResponse;
