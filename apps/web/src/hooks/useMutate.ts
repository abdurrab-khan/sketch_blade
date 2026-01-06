import { useToast } from "./use-toast.ts";
import useApiClient from "./useApiClient.ts";
import { ApiResponse, AxiosMutateProps } from "@/types/index.ts";
import { QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";

interface UseMutateProps<Req, Res> {
  isShowToast?: boolean;
  options?: QueryFilters;
  customMutationFn?: (data: AxiosMutateProps<Req>) => Promise<ApiResponse<Res | null>>;
  customOnSuccess?: (res?: ApiResponse<Res>) => void;
  finallyFn?: () => void;
}

const useMutate = <Res = undefined, Req = undefined>({
  options,
  isShowToast,
  finallyFn,
  customOnSuccess,
  customMutationFn,
}: UseMutateProps<Req, Res>) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  const mutationFn = async ({
    method,
    uri,
    data,
  }: AxiosMutateProps<Req>): Promise<ApiResponse<Res | null>> => {
    try {
      const res = await apiClient[method]<ApiResponse<Res>>(uri, data);
      return res?.data;
    } catch (err) {
      const error = err as ApiResponse;
      throw new Error(error.message);
    } finally {
      if (typeof finallyFn === "function") {
        finallyFn();
      }
    }
  };

  const { mutate, isPending, isError, data } = useMutation<
    ApiResponse<Res | null>,
    Error,
    AxiosMutateProps<Req>
  >({
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

      // call on success function if it's there
      if (typeof customOnSuccess === "function") {
        customOnSuccess(res);
      }

      // Show toast if isShowToast true
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
