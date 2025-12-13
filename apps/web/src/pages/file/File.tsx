import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ApiResponse } from "@/types/index.ts";
import { useToast } from "@/hooks/use-toast.ts";
import useResponse from "@/hooks/useResponse.tsx";

const File = () => {
  const fileId = useParams().id;
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!fileId) {
    navigate("/");

    toast({
      title: "Error",
      description: "Invalid request parameters",
      variant: "destructive",
    });
  }

  const { data, isPending, isError, error } = useResponse({
    queryKey: [fileId as string],
    queryProps: { uri: `/file/${fileId}` },
  });

  useEffect(() => {
    if (isError) {
      const err = error as unknown as ApiResponse;
      const route = err?.statusCode === 404 || !data ? "/404" : "/";

      navigate(route);
    }
  }, [isError, error, data, navigate]);

  if (isPending)
    return (
      <div className={"size-screen flex-center bg-primary"}>
        <Loader2 size={64} className={"text-quaternary animate-spin"} />
      </div>
    );

  return (
    <main className={"size-screen bg-primary text-quaternary relative"}>
      {/* <div className="flex size-full flex-col justify-between">
        <Nav fileId={fileId as string} />
        <ToolActions />
        <Footer />
      </div> */}
      {/* Konva -- Canvas */}
      {/* <Suspense fallback={<LoadingLayout />}>
        <Whiteboard />
      </Suspense> */}
    </main>
  );
};
export default File;
