import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { AxiosError, AxiosResponse } from "axios";
import { useToast } from "./use-toast.ts";
import { RootState } from "../redux/store.ts";
import { ApiResponse } from "../types/index.ts";
import { useNavigate } from "react-router";

interface type {
  queryKeys: string[];
  queryFn: ({
    clerkId,
  }: {
    clerkId: string;
  }) => Promise<AxiosResponse>;
}

export const useResponse = ({ queryFn, queryKeys }: type) => {
  const { _id: userClerkId } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();
  const navigate = useNavigate();

  const result = useQuery({
    queryKey: [...queryKeys],
    queryFn: async () => {
      const response = await queryFn({ clerkId: userClerkId });
      return response.data?.data || [];
    },
    retry: 2,
    retryDelay: 1000,
    enabled: !!userClerkId,
  });


  useEffect(() => {
    const { isError, error } = result;

    if (isError) {
      const axiosError = error as AxiosError<ApiResponse>;

      if (axiosError.response?.status === 403) {
        navigate("/sign-in");
      }

      toast({
        title: "Error",
        description:
          axiosError.response?.data?.message ||
          axiosError.message ||
          "An error occurred",
        variant: "destructive",
      });
    }
  }, [navigate, result, toast]);

  return result;
};
