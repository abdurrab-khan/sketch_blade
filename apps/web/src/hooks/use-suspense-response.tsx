import { useCallback, useMemo } from "react";

import useApiClient from "@/hooks/use-api-client";
import { QueryKey, useSuspenseQuery } from "@tanstack/react-query";

import { ApiResponse, AxiosQueryProps } from "@/types";

interface UseSuspenseResponseParams {
  queryKey: QueryKey;
  queryProps: AxiosQueryProps;
}

const useSuspenseResponse = <T,>({
  queryKey,
  queryProps,
}: UseSuspenseResponseParams): ApiResponse<T> => {
  const apiClient = useApiClient();

  const memoizedQueryKey = useMemo<QueryKey>(() => [...queryKey], [queryKey]);

  const queryFn = useCallback(async (): Promise<ApiResponse<T>> => {
    const response = await apiClient.get<ApiResponse<T>>(queryProps.uri);

    if (!response?.data) {
      throw new Error("No data received from API");
    }

    return response.data;
  }, [apiClient, queryProps.uri]);

  const result = useSuspenseQuery<ApiResponse<T>, Error, ApiResponse<T>, QueryKey>({
    queryKey: memoizedQueryKey,
    queryFn,
    retry: 3,
    retryDelay: 1000,
    refetchOnReconnect: true,
  });

  return result.data;
};

export default useSuspenseResponse;
