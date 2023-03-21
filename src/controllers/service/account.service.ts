import { Account } from "./../../entities/Account";
import { generateNumber } from "../../util/helper";
import { StatusCodes } from "http-status-codes";
import { User } from "../../entities/User";
import { AppDataSource } from "../../config/data-source";
import { Response } from "express";
import { TransactionStatus } from "../../util/enums";

const accountRepository = AppDataSource.getRepository(Account);

export const createAccount = async (user: User, transactionToken: string) => {
  try {
    let accountNumber: string;

    // Ensure that account number length is === 10
    do {
      accountNumber = generateNumber(9000000000).toString();

      // Ensure that account number is unique
      let checkAccNumber = await accountRepository.findBy({
        accountName: accountNumber,
      });

      if (checkAccNumber.length !== 0) {
        // Generated account number exists so the loop continues
        accountNumber = "0000";
      }
    } while (accountNumber.length !== 10);

    let account = new Account(
      user,
      accountNumber,
      user.fullName,
      transactionToken
    );

    account = await accountRepository.save(account);

    return {
      user_id: account.owner.id,
      account_name: account.accountName,
      account_number: account.accountNumber,
      account_bal: account.balance,
    };
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

export const getAccountByAccountNumber = async (account_number: string) => {
  return await accountRepository
    .createQueryBuilder("account")
    .where("account.account_number = :account_number", { account_number })
    .getOne();
};

export const getAccountByOwnerId = async (ownerId: number) => {
  return await accountRepository
    .createQueryBuilder("account")
    .where("account.owner_id = :id", { id: ownerId })
    .getOne();
};

export const transactonErrorResponse = (
  status: number,
  message: string,
  res: Response
) => {
  if (status !== StatusCodes.INTERNAL_SERVER_ERROR) {
    res.status(status).json({
      success: false,
      transactionStatus: TransactionStatus.DECLINE,
      message,
    });
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      transactionStatus: TransactionStatus.PENDING,
      message,
    });
  }
};
