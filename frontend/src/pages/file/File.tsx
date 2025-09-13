import { Loader2 } from "lucide-react";
import { Suspense, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ApiResponse } from "../../types/index.ts";
import { useToast } from "../../hooks/use-toast.ts";
import { Nav } from "../../components/file/Nav.tsx";
import { Footer } from "../../components/file/Footer.tsx";
import { useResponse } from "../../hooks/useResponse.tsx";
import ToolActions from "../../components/file/tools/ToolActions.tsx";
import Whiteboard from "../../components/file/whiteboard/Whiteboard.tsx";

const LoadingLayout = () => {
  return (
    <div className="z-2 fixed right-1/2 top-0 size-full translate-x-1/2 flex-center" >
      <p className="text-2xl">
        Loading...
      </p>
    </div>
  )
}

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
    queryKeys: [fileId as string],
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
        <Loader2 size={64} className={"animate-spin text-quaternary"} />
      </div>
    );

  return (
    <main className={"size-screen relative bg-primary text-quaternary"}>
      <div className="flex size-full flex-col justify-between">
        <Nav fileId={fileId as string} />
        <ToolActions />
        <Footer />
      </div>
      {/* Konva -- Canvas */}
      <Suspense fallback={<LoadingLayout />}>
        <Whiteboard />
      </Suspense>
    </main>
  );
};
export default File;

