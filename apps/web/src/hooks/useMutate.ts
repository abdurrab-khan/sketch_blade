import { useToast } from "./use-toast.ts";
import useApiClient from "./useApiClient.ts";
import { ApiResponse, AxiosMutateProps } from "@/types/index.ts";
import { QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";

interface UseMutateProps {
  isShowToast?: boolean;
  options?: QueryFilters;
  customMutationFn?: (data: AxiosMutateProps) => Promise<ApiResponse>;
  finallyFn?: () => void;
}

const useMutate = <T>({ options, isShowToast, finallyFn, customMutationFn }: UseMutateProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  const mutationFn = async ({ method, uri, data }: AxiosMutateProps) => {
    try {
      const res = await apiClient[method]<ApiResponse<T>>(uri, data);
      return res.data ?? null;
    } catch (err) {
      const error = err as ApiResponse;
      throw new Error(error.message);
    } finally {
      if (typeof finallyFn === "function") {
        finallyFn();
      }
    }
  };

  const { mutate, isPending, isError, data } = useMutation({
    mutationKey: ["deleteFile"],
    mutationFn: customMutationFn ?? mutationFn,
    onSuccess: async (res) => {
      const queryKeys = options?.queryKey;

      // TODO: Implement Updates from mutation response ---> https://tanstack.com/query/latest/docs/framework/react/guides/updates-from-mutation-responses

      // invalidate queries
      if (queryKeys) {
        await Promise.all(
          queryKeys.map((key) => queryClient.invalidateQueries({ queryKey: [key] })),
        );
      }

      if (isShowToast) {
        toast({
          title: "Success",
          description: res?.message || "Successfully deleted",
        });
      }
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err?.message || "An error occurred",
        variant: "destructive",
      });
    },
    networkMode: "online",
    retry: 1,
    retryDelay: 1000,
  });

  return {
    mutate,
    isPending,
    isError,
    data,
  };
};

export default useMutate;
