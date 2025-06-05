interface IErrorHandler {
   statusCode: number;
   message?: string;
}

export default class ErrorHandler extends Error {
   statusCode: number;
   stack?: string | undefined;

   constructor({
      statusCode,
      message = "Something went wrong",
   }: IErrorHandler) {
      super(message);
      this.statusCode = statusCode;
      if (!this.stack) {
         this.stack = new Error().stack;
      }
   }
}
