import { createAccount } from "./service/account.service";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { createJWT } from "../middleware/jwt.setup";
import { User } from "../entities/User";
import { encryptString, generateNumber } from "../util/helper";

// @desc    User sign up auth
// @route   GET /auth/sign-up
// @req.body { "fullName": "Test Case1", "email": "test@gmail.com", "password": "password"}
export const signUp = async (req: Request, res: Response) => {
  let { fullName, email, password } = req.body;
  password = await encryptString(password);

  let user = await new User(fullName, email, password).save();

  let transactionToken: string;

  // Ensure that transaction token is === 4
  do {
    transactionToken = generateNumber(9000).toString();
  } while (transactionToken.length !== 4);
  const encryptToken = await encryptString(transactionToken);

  console.log(user.getId());

  const accountDeets: any = await createAccount(user, encryptToken);
  const jwt = createJWT(user.getId(), user.getFullName());

  return res.status(StatusCodes.CREATED).json({
    success: true,
    data: {
      account_name: accountDeets.accountName,
      account_number: accountDeets.accountNumber,
      transaction_token: transactionToken,
      account_bal: accountDeets.balance,
    },
    jwt,
  });
};

export const signIn = async (req: Request, res: Response) => {
  console.log("Signed in successfully");
  console.log();
};
