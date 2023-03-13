import { generateNumber } from "../../util/helper";
import { Account } from "../../entities/Account";
import { StatusCodes } from "http-status-codes";
import { User } from "../../entities/User";

export const createAccount = async (user: User, transactionToken: string) => {
  try {
    let accountNumber: string;

    // Ensure that account number is === 10
    do {
      accountNumber = generateNumber(9000000000).toString();
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
