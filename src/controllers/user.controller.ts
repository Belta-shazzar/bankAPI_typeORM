import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/data-source";
import { createAccount } from "./service/account.service";
import { StatusCodes } from "http-status-codes";
import { createJWT } from "../middleware/jwt.setup";
import { User } from "../entities/User";
import { encryptString, generateNumber, validateString } from "../util/helper";

const userRepository = AppDataSource.getRepository(User);
const dataSource = AppDataSource.manager;

// @desc    User sign up auth
// @route   GET /auth/sign-up
// @req.body { "fullName": "Test Case1", "email": "test@gmail.com", "password": "password"}
export const signUp = async (req: Request, res: Response) => {
  let { fullName, email, password } = req.body;
  const checkMail = await getByMail(email);

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

// Not complete
export const signIn = async (req: Request, res: Response) => {
  let { email, password } = req.body;
  let status = StatusCodes.OK;
  let msg = "something went wrong";

  const user: any = await getByMail(email);
  if (!user) {
    status = StatusCodes.NOT_FOUND;
    msg = "email not found";
  }

  const validatePassword = await validateString(password, user.getPassword()!);

  if (validatePassword !== true) {
    status = StatusCodes.UNAUTHORIZED;
    msg = "incorrect password";
  }

  const jwt = createJWT(user.getId(), user.getFullName());

  if (status !== StatusCodes.OK) {
    res.status(status).json({ success: false, msg: msg });
  }

  console.log(user);

  res.status(status).json({ success: true, data: {}, jwt });
};

export const getByMail = async (email: string) => {
  return await userRepository
    .createQueryBuilder("user")
    .where("user.email = :email", { email })
    .getOne();
};
