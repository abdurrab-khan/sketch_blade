import zod from "zod";
import { ErrorHandler } from "../../utils";

const zodParserHelper = <T extends zod.ZodObject, V extends object>(
   schema: T,
   value: V = {} as V,
) => {
   try {
      const parseResult = schema.safeParse(value);

      if (parseResult?.error && !parseResult?.success) {
         throw new Error(parseResult.error.issues[0].message);
      }

      return parseResult.data;
   } catch (err) {
      const msg = err instanceof Error ? err.message : "Invalid data format";
      throw new ErrorHandler({
         statusCode: 400,
         message: msg,
      });
   }
};

export default zodParserHelper;
