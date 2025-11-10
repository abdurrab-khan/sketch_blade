import { QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast.ts";
import useApiClient from "./useApiClient.ts";
import { ApiResponse, AxiosMutateProps } from "@/types/index.ts";

interface useMutateProps {
  finallyFn: () => void;
  isShowToast?: boolean;
  options?: QueryFilters;
}

const useMutate = ({ finallyFn, options, isShowToast }: useMutateProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  const mutationFn = async (mutateProps: AxiosMutateProps) => {
    try {
      const res = await apiClient[mutateProps.method](mutateProps.uri, mutateProps.data);

      return res?.data || null;
    } catch (err) {
      const error = err as ApiResponse;

      throw new Error(error.message);
    } finally {
      if (finallyFn) {
        finallyFn();
      }
    }
  };

  const { mutate, isPending, isError, data } = useMutation({
    mutationKey: ["deleteFile"],
    mutationFn,
    onSuccess: (res) => {
      if (options) {
        queryClient.invalidateQueries(options);
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
