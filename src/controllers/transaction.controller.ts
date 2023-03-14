import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Transaction } from "../entities/Transaction";
import { errorResponse } from "../util/helper";
import { StatusCodes } from "http-status-codes";

const transactionRepository = AppDataSource.getRepository(Transaction)

export const getAllTransactionReceipt = async (req: any, res: Response) => {

try {
  const transactions = await transactionRepository
    .createQueryBuilder("transaction")
    .where("transaction.authorId = :id", { id: req.user.userId })
    .getMany();
  
  return res.status(StatusCodes.OK).json({ success: true, data: { transactions } })
} catch (error) {
  console.log(error);
  let status = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = "something went wrong";
  errorResponse(status, message, res);
}
  console.log("All your transactions...");
  console.log();
};

export const getATransactionReceipt = async (req: Request, res: Response) => {
  console.log("One of your transactions...");
  console.log();
};