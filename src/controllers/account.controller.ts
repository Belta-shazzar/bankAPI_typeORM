import { createTransactionReceipt } from "./service/transaction.service";
import { getUserById } from "./service/user.service";
import {
  getAccountByAccountNumber,
  getAccountByOwnerId,
  transactonErrorResponse,
} from "./service/account.service";
import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Account } from "../entities/Account";
import { validateString, errorResponse } from "../util/helper";
import { StatusCodes } from "http-status-codes";
import { TransactionStatus, TransactionType } from "../util/enums";

const accountRepository = AppDataSource.getRepository(Account);

// @desc    Account fund account
// @route   POST /account/fund-account
// @req.body {  "accountNumber": <<account number>>, "transactionToken": <<transaction token>>, "amount": <<amount>> }
export const fundAccount = async (req: any, res: Response) => {
  let status = StatusCodes.INTERNAL_SERVER_ERROR;
  let msg = "something went wrong";
  let transactionStatus: TransactionStatus;
  try {
    const { userId, name } = req.user;
    const { accountNumber, transactionToken, amount } = req.body;

    const account = await getAccountByAccountNumber(accountNumber);

    if (!account || account.getAccountName() !== name) {
      status = StatusCodes.NOT_FOUND;
      msg = "account does not exist";
      transactionStatus = TransactionStatus.DECLINE;
      throw new Error(msg);
    }

    const validateToken = await validateString(
      transactionToken,
      account?.getTransactionToken()!
    );

    if (validateToken !== true) {
      status = StatusCodes.UNAUTHORIZED;
      msg = "incorrect token";
      throw new Error(msg);
    }

    account.setBalance(account.getBalance() + amount);
    const updatedAccount: any = await accountRepository.save(account);
    transactionStatus = TransactionStatus.SUCCESS;

    const user = await getUserById(userId);

    await createTransactionReceipt(
      user,
      updatedAccount.accountNumber,
      updatedAccount,
      TransactionType.DEPOSIT,
      amount,
      transactionStatus
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        transaction_status: transactionStatus,
        balance: updatedAccount.getBalance(),
      },
    });
  } catch (error) {
    console.log(error);
    transactonErrorResponse(status, msg, res);
  }
};

// @desc    Account check account balance
// @route   GET /account/check-balance
// @req.body nil
export const checkBalance = async (req: any, res: Response) => {
  try {
    const account = await getAccountByOwnerId(req.user.userId);

    return res
      .status(StatusCodes.OK)
      .json({ success: true, data: { balance: account?.getBalance() } });
  } catch (error) {
    console.log(error);
    let status = StatusCodes.INTERNAL_SERVER_ERROR;
    let message = "something went wrong";
    errorResponse(status, message, res);
  }
};

// @desc    Account withdraw fund
// @route   GET /account/withdraw
// @req.body { "transaction_token": <<transaction token>>, "amount": <<amount>> }
export const withdrawFunds = async (req: any, res: Response) => {
  let status = StatusCodes.INTERNAL_SERVER_ERROR;
  let msg = "something went wrong";
  let transactionStatus: TransactionStatus;
  try {
    const { transaction_token, amount } = req.body;
    const account = await getAccountByOwnerId(req.user.userId);

    if (!account) {
      status = StatusCodes.NOT_FOUND;
      msg = "account not found";
      throw new Error(msg);
    }
    
    const newBalance = account.getBalance() - amount;
    account.setBalance(newBalance);
    const updatedAccount = await accountRepository.save(account);
    transactionStatus = TransactionStatus.SUCCESS;

    const user = await getUserById(req.user.userId);

    await createTransactionReceipt(
      user,
      updatedAccount.accountNumber,
      updatedAccount,
      TransactionType.WITHDRAW,
      amount,
      transactionStatus
    );


    return res
      .status(StatusCodes.OK)
      .json({
        success: true,
        data: { amount_withdrawn: amount, new_balance: newBalance },
      });
  } catch (error) {
    console.log(error);
    transactonErrorResponse(status, msg, res);
  }
};

export const transferFunds = async (req: Request, res: Response) => {
  console.log("Transfer successful");
  console.log();
};
