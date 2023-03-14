import bcrypt from "bcryptjs";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export const encryptString = async (toEncrypt: string) => {
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_GENSALT!));
  return (toEncrypt = await bcrypt.hash(toEncrypt, salt));
};

export const validateString = async (
  toValidate: string,
  actualValue: string
) => {
  return await bcrypt.compare(toValidate, actualValue);
};

export const generateNumber = (rangeLength: number) => {
  return Math.floor(10 + Math.random() * rangeLength);
};

export const errorResponse = (status: number, message: string, res: Response) => {
  if (status !== StatusCodes.INTERNAL_SERVER_ERROR) {
    res.status(status).json({
      success: false,
      message,
    });
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message,
    });
  }
}
