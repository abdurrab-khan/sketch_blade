import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useToast } from "@/hooks/use-toast.ts";
import useResponse from "@/hooks/useResponse.tsx";
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
      const token = await getToken(); // fetching token for authenticating user

      if (!token) {
        navigate("/sign-in");
        return;
      }

      setToken(token);
      setIsTokenPending(false);
    })();
  }, [getToken, toast, navigate]);

  // If pending show loader spinner
  if (isPending || isTokenPending)
    return (
      <div className={"size-screen flex-center bg-primary"}>
        <Loader2 size={64} className={"text-quaternary animate-spin"} />
      </div>
    );

  // If getting any error navigate to dashboard
  if (isError || !data?.data) {
    navigate("/dashboard");

    toast({
      title: "Error",
      description: error?.message ?? "Invalid file id",
      variant: "destructive",
    });
    return;
  }

  return (
    <main className={"size-screen bg-primary text-quaternary relative"}>
      <Whiteboard id={fileId!} file={data.data} token={token} />
    </main>
  );
};
export default File;
