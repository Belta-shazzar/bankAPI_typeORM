import { getByAccountNumber } from "./service/account.service";
import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Account } from "../entities/Account";
import { validateString } from "../util/helper";
import { Transaction } from "../entities/Transaction";
import { StatusCodes } from "http-status-codes";
import { TransactionStatus } from "../util/enums";

const accountRepository = AppDataSource.getRepository(Account);

// @desc    Account fund account
// @route   GET /account/fund-account
// @req.body {  "accountNumber": <<account number>>, "transactionToken": <<transaction token>>, "amount": <<amount>> }
export const fundAccount = async (req: any, res: Response) => {
  let transactionReceipt: Transaction;
  let status = StatusCodes.OK;
  let msg = "something went wrong";
  let transactionStatus: TransactionStatus;
  try {
    const { userId, name } = req.user;
    const { accountNumber, transactionToken, amount } = req.body;

    const account = await getByAccountNumber(accountNumber);

    if (!account || account.getaccountName !== name) {
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

    account.setBalance(account.getBalance + amount);
    const updatedAccount = await accountRepository.save(account);

    console.log(updatedAccount)


  } catch (error) {
    console.log(error);
    if (
      status === StatusCodes.NOT_FOUND ||
      status === StatusCodes.UNAUTHORIZED
    ) {
      res
        .status(status)
        .json({
          success: false,
          transactionStatus: TransactionStatus.DECLINE,
          msg,
        });
    } else {
      res
        .status(status)
        .json({
          success: false,
          transactionStatus: TransactionStatus.PENDING,
          msg,
        });
    }
  }
};

export const checkBalance = async (req: Request, res: Response) => {
  console.log("Your balance...");
  console.log();
};

export const withdrawFunds = async (req: Request, res: Response) => {
  console.log("Account Debited");
  console.log();
};

export const transferFunds = async (req: Request, res: Response) => {
  console.log("Transfer successful");
  console.log();
};
