import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Transaction } from "../entities/Transaction";
import { errorResponse } from "../util/helper";
import { StatusCodes } from "http-status-codes";

const transactionRepository = AppDataSource.getRepository(Transaction)

// @desc    Transaction Get all transaction receipt
// @route   GET /transaction/
// @req.body nil
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
};

// @desc    Transaction a transaction receipt
// @route   GET /transaction/:id
// @req.body nil
export const getATransactionReceipt = async (req: any, res: Response) => {
let status = StatusCodes.INTERNAL_SERVER_ERROR;
let message = "something went wrong";
  try {
    const { id: transactionId } = req.params;
    const transaction = await transactionRepository
      .createQueryBuilder("transaction")
      .where("transaction.authorId = :userId", { userId: req.user.userId })
      .andWhere("transaction.id = :transId", { transId: transactionId })
      .getOne();

    return res
      .status(StatusCodes.OK)
      .json({ success: true, data: { transaction } });
  } catch (error) {
    console.log(error);
    
    errorResponse(status, message, res);
  }
};