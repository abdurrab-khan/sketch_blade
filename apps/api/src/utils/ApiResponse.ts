export default class ApiResponse {
   data: any;
   message: string;
   statusCode: number;
   success: boolean;

   constructor({
      data,
      message,
      statusCode,
   }: {
      data?: any;
      message: string;
      statusCode: number;
   }) {
      this.message = message;
      this.statusCode = statusCode;
      this.success = statusCode < 300 ? true : false;

      if (data) {
         this.data = data;
      }
   }
}
