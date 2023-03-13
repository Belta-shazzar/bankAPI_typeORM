import { StatusCodes } from "http-status-codes";
import { CustomApiError } from "./custom-error";

export class ConflictError extends CustomApiError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
  }
}
