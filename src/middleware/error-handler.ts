import { Request, Response, NextFunction, ErrorRequestHandler } from "express"

import StatusCodes from 'http-status-codes';

export const errorHandlerMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
  }

  return res.status(customError.statusCode).json({ success: false, msg: customError.msg })
}

