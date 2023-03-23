import { Request, Response } from "express";
// import { AppDataSource } from "../config/data-source";
import { createAccountOps, getAccountByOwner } from "./service/account.service";
import { StatusCodes } from "http-status-codes";
import { createJWT } from "../middleware/jwt.setup";
import { User } from "../entities/User";
import { getUserByMail } from "./service/user.service";
import {
  errorResponse,
  encryptString,
  generateNumber,
  validateString,
} from "../util/helper";

// const userRepository = AppDataSource.getRepository(User);

// @desc    User sign up auth
// @route   POST /auth/sign-up
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

  let user = new User(fullName, email, password);

  let transaction_token: string;

  // Ensure that transaction token is === 4
  do {
    transaction_token = generateNumber(9000).toString();
  } while (transaction_token.length !== 4);
  const encryptToken = await encryptString(transaction_token);

  const { user_id, account_name, account_number, account_bal } =
    await createAccountOps(user, encryptToken);

  // generate JWT token
  const jwt = createJWT(user_id, user.fullName);

  return res.status(StatusCodes.CREATED).json({
    success: true,
    data: {
      account_name,
      account_number,
      transaction_token,
      account_bal,
    },
    jwt,
  });
};

// @desc    User sign in auth
// @route   POST /auth/sign-in
// @req.body { "email": "test@gmail.com", "password": "password"}
// Not complete
export const signIn = async (req: Request, res: Response) => {
  let { email, password } = req.body;
  let status = StatusCodes.INTERNAL_SERVER_ERROR;
  let msg = "something went wrong";

  try {
    let user = await getUserByMail(email);
    if (!user) {
      status = StatusCodes.NOT_FOUND;
      msg = "email not found";
      throw new Error(msg);
    }

    const validatePassword = await validateString(
      password,
      user.password
    );

    if (validatePassword !== true) {
      status = StatusCodes.UNAUTHORIZED;
      msg = "incorrect password";
      throw new Error(msg);
    }

    // generate JWT token
    const jwt = createJWT(user.id, user.fullName);

    const userAccounts = await getAccountByOwner(user)
    console.log(userAccounts);
    console.log();
    console.log(user)

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        user: { Id: user.id, email: user.email },
        account: {
          userAccounts
        },
      },
      jwt,
    });
  } catch (error) {
    console.log(error);
    errorResponse(status, msg, res);
  }
};
