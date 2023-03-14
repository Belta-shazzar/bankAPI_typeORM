import { errorResponse } from "./../util/helper";
import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { createAccount } from "./service/account.service";
import { StatusCodes } from "http-status-codes";
import { createJWT } from "../middleware/jwt.setup";
import { User } from "../entities/User";
import { getUserByMail } from "./service/user.service";
import { encryptString, generateNumber, validateString } from "../util/helper";

// @desc    User sign up auth
// @route   GET /auth/sign-up
// @req.body { "fullName": "Test Case1", "email": "test@gmail.com", "password": "password"}
export const signUp = async (req: Request, res: Response) => {
  let { fullName, email, password } = req.body;
  const checkMail = await getUserByMail(email);

  if (checkMail) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, msg: "email already exist" });
  }

  password = await encryptString(password);

  let user = await new User(fullName, email, password).save();

  let transactionToken: string;

  // Ensure that transaction token is === 4
  do {
    transactionToken = generateNumber(9000).toString();
  } while (transactionToken.length !== 4);
  const encryptToken = await encryptString(transactionToken);

  const accountDeets: any = await createAccount(user, encryptToken);

  user.setAccount(accountDeets);
  user = await user.save();

  const jwt = createJWT(user.getId(), user.getFullName());
  // userRepository.create(user)

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

// @desc    User sign in auth
// @route   GET /auth/sign-in
// @req.body { "email": "test@gmail.com", "password": "password"}
// Not complete
export const signIn = async (req: Request, res: Response) => {
  let { email, password } = req.body;
  let status = StatusCodes.INTERNAL_SERVER_ERROR;
  let msg = "something went wrong";

  try {
    let user: any = await getUserByMail(email);
    if (!user) {
      status = StatusCodes.NOT_FOUND;
      msg = "email not found";
      throw new Error(msg);
    }

    const validatePassword = await validateString(
      password,
      user.getPassword()!
    );

    if (validatePassword !== true) {
      status = StatusCodes.UNAUTHORIZED;
      msg = "incorrect password";
      throw new Error(msg);
    }

    const jwt = createJWT(user.getId(), user.getFullName());
    user.account = await AppDataSource.createQueryBuilder()
      .relation(User, "account")
      .of(user)
      .loadOne();

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        user: { Id: user.id, email: user.email },
        account: {
          id: user.account.id,
          accountName: user.account.accountName,
          accountNumber: user.account.accountNumber,
          accountBalance: user.account.balance,
        },
      },
      jwt,
    });
  } catch (error) {
    console.log(error);
    errorResponse(status, msg, res);
  }
};
