import { createTransactionReceipt } from "./service/transaction.service";
import { getById } from "./service/user.service";
import { getByAccountNumber, transactonErrorResponse } from "./service/account.service";
import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Account } from "../entities/Account";
import { validateString } from "../util/helper";
import { StatusCodes } from "http-status-codes";
import { TransactionStatus, TransactionType } from "../util/enums";

const accountRepository = AppDataSource.getRepository(Account);

// @desc    Account fund account
// @route   GET /account/fund-account
// @req.body {  "accountNumber": <<account number>>, "transactionToken": <<transaction token>>, "amount": <<amount>> }
export const fundAccount = async (req: any, res: Response) => {
  let status = StatusCodes.INTERNAL_SERVER_ERROR;
  let msg = "something went wrong";
  let transactionStatus: TransactionStatus;
  try {
    const { userId, name } = req.user;
    const { accountNumber, transactionToken, amount } = req.body;

    const account = await getByAccountNumber(accountNumber);

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

    const user = await getById(userId);

    await createTransactionReceipt(
      user,
      updatedAccount.accountNumber,
      updatedAccount,
      TransactionType.DEPOSIT,
      amount,
      transactionStatus
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        transaction_status: transactionStatus,
        balance: updatedAccount.getBalance(),
      },
    });
  } catch (error) {
    console.log(error);
    transactonErrorResponse(status, msg, res)
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
