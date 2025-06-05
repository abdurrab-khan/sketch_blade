import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast.ts";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store.ts";
import { AxiosError, AxiosResponse } from "axios";

const useMutate = ({
  mutateFn,
  options,
  finallyFn,
  isShowSuccessToast = false,
}: {
  mutateFn: ({
    clerkId,
    data,
  }: {
    clerkId: string;
    data: any;
  }) => Promise<AxiosResponse>;
  options?: { [key: string]: string[] };
  finallyFn?: () => void;
  isShowSuccessToast?: boolean;
}): { mutate: any; isPending: boolean; isError: boolean; data?: any } => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const clerkId = useSelector((state: RootState) => state.auth._id);

  const mutationFn = async (data) => {
    try {
      const res = await mutateFn({ clerkId, data: data || {} });
      return res.data?.data || [];
    } catch (err) {
      const error = err as AxiosError;
      throw new Error(error.response?.data?.message || error.message);
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
      if (isShowSuccessToast) {
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
