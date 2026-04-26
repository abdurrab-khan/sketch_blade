import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useToast } from "@/hooks/use-toast.ts";
import useResponse from "@/hooks/use-response";
import Whiteboard from "@/pages/file/components/Whiteboard";
import { FileData } from "@/types/file";
import { useAuth } from "@clerk/clerk-react";

const File = () => {
  const [token, setToken] = useState<string>("");
  const [isTokenPending, setIsTokenPending] = useState<boolean>(true);

  const { getToken } = useAuth();
  const { id: fileId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data, isPending, isError, error } = useResponse<FileData>({
    queryKey: [fileId as string],
    queryProps: { uri: `/file/${fileId}` },
    queryOptions: {
      enabled: !!fileId,
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();

        if (!token) {
          navigate("/sign-in");
          return;
        }

        setToken(token);
      } finally {
        setIsTokenPending(false);
      }
    })();
  }, [getToken, navigate]);

  useEffect(() => {
    if (isPending) return;

    if (isError || !data?.data) {
      toast({
        title: "Error",
        description: error?.message ?? "Invalid file id",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [isPending, isError, data?.data, error, toast, navigate]);

  // If pending show loader spinner
  if (isPending || isTokenPending)
    return (
      <div className={"size-screen flex-center bg-primary dark:bg-primary-bg-dark dark:text-white"}>
        <Loader2 size={48} className={"text-quaternary animate-spin"} />
      </div>
    );

  // Keep a stable fallback while navigation effect redirects
  if (isError || !data?.data) return null;

  return (
    <main className={"size-screen bg-primary text-quaternary relative"}>
      <Whiteboard id={fileId!} file={data.data} token={token} />
    </main>
  );
};
export default File;
