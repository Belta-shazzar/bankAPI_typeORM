import { StatusCodes } from "http-status-codes";
import { CustomApiError } from "./custom-error";

export class BadRequestError extends CustomApiError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
