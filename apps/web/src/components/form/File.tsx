import z from "zod";
import { useForm } from "react-hook-form";
import { fileSchema } from "@/lib/zod/schemas.ts";
import { zodResolver } from "@hookform/resolvers/zod";

import { File } from "@/types/file.ts";

import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import AddCollaboratorInput from "../AddCollaboratorInput.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { DialogFooter } from "@/components/ui/dialog.tsx";
import useApiClient from "@/hooks/useApiClient.ts";
import { useEffect } from "react";
import { ApiResponse } from "@/types/index.ts";
import { Collaborator } from "@/types/collaborator.ts";
import { ICollaboratorState } from "../dialogs/Updatefile.tsx";

interface FileformProps {
  isPending: boolean;
  type: "create" | "update";
  fileData?: Partial<File>;
  collaboratorState?: ICollaboratorState;
  setCollaboratorState?: React.Dispatch<React.SetStateAction<ICollaboratorState>>;
  handleFormSubmit: (data: z.infer<typeof fileSchema>) => void;
}

function Fileform({
  isPending,
  type,
  fileData,
  collaboratorState,
  setCollaboratorState,
  handleFormSubmit,
}: FileformProps) {
  const apiClient = useApiClient();

  const form = useForm<z.infer<typeof fileSchema>>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      fileName: fileData?.name ?? "",
      collaborators: [],
      description: fileData?.description ?? "",
    },
  });
  const { handleSubmit, reset, control, setValue, watch } = form;

  const handleFileFormSubmit = async (data: z.infer<typeof fileSchema>) => {
    handleFormSubmit(data); // calling submit form
    reset(); // reseting form
  };

  useEffect(() => {
    // no need to fetch collaborators -- creating new file
    if (!fileData?._id) return;

    apiClient.get<ApiResponse<Collaborator[]>>(`/collaborator/${fileData._id}`).then((d) => {
      const res = d.data;

      if (res?.success && res?.data) {
        setValue("collaborators", res.data);
      }
    });
  }, [fileData?._id, apiClient, setValue]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleFileFormSubmit)} className="space-y-4">
        <FormField
          control={control}
          name="fileName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter file name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <AddCollaboratorInput
          watch={watch}
          setValue={setValue}
          collaboratorState={collaboratorState}
          setCollaboratorState={setCollaboratorState}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter file description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button
            type="submit"
            variant={"primary"}
            disabled={isPending}
            className={"w-full cursor-pointer"}
          >
            {isPending ? (
              <Loader2 className="mr-3 h-8 w-8 animate-spin" />
            ) : (
              <span>{type === "create" ? "Create file" : "Update file"}</span>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default Fileform;
