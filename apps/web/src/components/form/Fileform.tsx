import z from "zod";
import { UseFormReturn } from "react-hook-form";
import { fileSchema } from "@/lib/zod/schemas.ts";

import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { DialogFooter } from "@/components/ui/dialog.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";

interface ICreateFileForm {
  type: "create";
  isPending: boolean;
  createFileSubmit: (data: z.infer<typeof fileSchema>) => void;
  form: UseFormReturn<z.infer<typeof fileSchema>>;
}

interface IUpdateFileForm {
  fileId: string;
  type: "update";
  isPending: boolean;
  form: UseFormReturn<z.infer<typeof fileSchema>>;
  updateFileSubmit: (data: z.infer<typeof fileSchema>) => void;
}

function Fileform(props: ICreateFileForm | IUpdateFileForm) {
  const { isPending, type, form } = props;
  const { control, handleSubmit } = form;
  const handleFormSubmit = type === "create" ? props.createFileSubmit : props.updateFileSubmit;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
