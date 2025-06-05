import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router";
import Container from "./Container.tsx";
import { ApiResponse } from "../../types/index.ts";
import { useToast } from "../../hooks/use-toast.ts";
import { Nav } from "../../components/file/Nav.tsx";
import { Footer } from "../../components/file/Footer.tsx";
import { useResponse } from "../../hooks/useResponse.tsx";
import ToolActions from "../../components/file/tools/ToolActions.tsx";
import Canvas from "../../components/file/canvas/Canvas.tsx";

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
    queryFn: async ({ clerkId }) => {
      return axios.get(`file/${fileId}`, {
        headers: {
          Authorization: `Bearer ${clerkId}`,
        },
      });
    },
  });

  useEffect(() => {
    if (isError) {
      const err = error as AxiosError<ApiResponse>;
      const route = err?.response?.status === 404 ? "/404" : "/";
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
    <main
      className={
        "size-screen relative bg-primary px-2 py-2 text-quaternary md:px-6 lg:px-10"
      }
    >
      <Container>
        <Nav fileId={fileId as string} />
        <ToolActions />
        <Canvas />
        <Footer />
      </Container>
    </main>
  );
};
export default File;
