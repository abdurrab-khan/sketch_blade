import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "@clerk/clerk-react";

import Whiteboard from "@/pages/file/components/Whiteboard";
import { FileData } from "@/types/file";
import useApiClient from "@/hooks/use-api-client";
import { ApiResponse } from "@/types";
import useTheme from "@/hooks/use-theme";

const useAuthToken = () => {
  const [token, setToken] = useState<string>("");
  const [isTokenPending, setIsTokenPending] = useState<boolean>(true);

  const { getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let ignored = false;

    const fetchToken = async () => {
      if (ignored) return;

      try {
        const token = await getToken();

        if (!token) {
          throw new Error("No token retrieved");
        }

        setToken(token);
      } catch {
        navigate("/sign-in");
      } finally {
        setIsTokenPending(false);
      }
    };

    fetchToken();

    return () => {
      ignored = true;
    };
  }, [getToken, navigate]);

  return {
    token,
    isTokenPending,
  };
};

const useFileLoader = (fileId: string) => {
  const apiClient = useApiClient();
  const [data, setData] = useState<FileData | null>(null);
  const [isPending, setIsPending] = useState<boolean>(true);

  useEffect(() => {
    let ignored = false;

    const fetchFile = async () => {
      if (ignored) return;
      try {
        const response = await apiClient.get<ApiResponse<FileData>>(`/file/${fileId}`);
        console.log("Fetched file data: ", response?.data);
        setData(response?.data?.data || null);
      } catch {
        setData(null);
      } finally {
        setIsPending(false);
      }
    };

    fetchFile();

    return () => {
      ignored = true;
    };
  }, [apiClient, fileId]);

  return {
    data,
    isPending,
  };
};

const File = () => {
  const isDarkMode = useTheme();
  const { id: fileId } = useParams();
  const { data, isPending } = useFileLoader(fileId!);
  const { token, isTokenPending } = useAuthToken();

  if (isPending || isTokenPending)
    return (
      <div className={"size-screen flex-center bg-primary dark:bg-primary-bg-dark dark:text-white"}>
        <Loader2 size={48} className={"text-quaternary animate-spin"} />
      </div>
    );

  if (data === null) {
    return (
      <div className={"size-screen flex-center bg-primary dark:bg-primary-bg-dark dark:text-white"}>
        <p className={"text-quaternary"}>File not found.</p>
      </div>
    );
  }

  return (
    <main className={"size-screen bg-primary text-quaternary relative"}>
      <Whiteboard id={fileId!} file={data} token={token} isDarkMode={isDarkMode} />
    </main>
  );
};
export default File;
