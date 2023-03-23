import { Account } from "./../../entities/Account";
import { generateNumber } from "../../util/helper";
import { StatusCodes } from "http-status-codes";
import { User } from "../../entities/User";
import { AppDataSource } from "../../config/data-source";
import { Response } from "express";
import { TransactionStatus } from "../../util/enums";

const accountRepository = AppDataSource.getRepository(Account);

export const createAccountOps = async (
  user: User,
  transactionToken: string
) => {
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
  return await accountRepository.findOneBy({ accountNumber: account_number });
};

export const getAccountByOwner = async (owner: User) => {
  const accounts = await accountRepository.find({
    where: { owner: owner },
    select: { id: true, accountNumber: true, balance: true },
  });

  return accounts.map(({ id, accountNumber, balance }) => ({
    id,
    accountNumber,
    balance,
  }));
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
