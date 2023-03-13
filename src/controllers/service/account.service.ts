import { generateNumber } from "../../util/helper";
import { StatusCodes } from "http-status-codes";
import { User } from "../../entities/User";
import { AppDataSource } from "../../config/data-source";
import { Account } from "../../entities/Account";
const accountRepository = AppDataSource.getRepository(Account);

export const createAccount = async (user: User, transactionToken: string) => {
  try {
    let accountNumber: string;

    // Ensure that account number is === 10
    do {
      accountNumber = generateNumber(9000000000).toString();

      // Ensure that account number is unique
    } while (accountNumber.length !== 10);

    return await new Account(
      user,
      user.getFullName(),
      accountNumber,
      transactionToken
    ).save();
    // return await account.save();
  } catch (error) {
    console.log("Got here tho");
    console.log(error);
    throw new Error();
  }
};

export const getByAccountNumber = async (account_number: string) => {
  const account = await accountRepository
    .createQueryBuilder("account")
    .where("account.account_number = :account_number", { account_number })
    .getOne();

  console.log(account);

  return account;
};
