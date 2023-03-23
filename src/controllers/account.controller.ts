import { Account } from './../entities/Account';
import { createTransactionReceipt } from "./service/transaction.service";
import { getUserById } from "./service/user.service";
import {
  createAccountOps,
  getAccountByAccountNumber,
  getAccountByOwner,
  getAccountBalance,
  transactonErrorResponse,
} from "./service/account.service";
import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import {
  validateString,
  errorResponse,
  encryptString,
  generateNumber,
} from "../util/helper";
import { StatusCodes } from "http-status-codes";
import { TransactionStatus, TransactionType } from "../util/enums";

const accountRepository = AppDataSource.getRepository(Account);

// // @desc    Account create account
// // @route   POST /account/fund-account
// // @req.body {  "accountNumber": <<account number>>, "transactionToken": <<transaction token>>, "amount": <<amount>> }
export const createAccount = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;

    const user = await getUserById(userId);

    let transaction_token: string;

    // Ensure that transaction token is === 4
    do {
      transaction_token = generateNumber(9000).toString();
    } while (transaction_token.length !== 4);
    const encryptToken = await encryptString(transaction_token);

    const { account_name, account_number, account_bal } =
      await createAccountOps(user, encryptToken);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: {
        account_name,
        account_number,
        transaction_token,
        account_bal,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("something went wrong");
  }
};

// @desc    Account fund account
// @route   POST /account/fund-account
// @req.body {  "accountNumber": <<account number>>, "transactionToken": <<transaction token>>, "amount": <<amount>> }
export const fundAccount = async (req: any, res: Response) => {
  let status = StatusCodes.INTERNAL_SERVER_ERROR;
  let msg = "something went wrong";
  let transactionStatus: TransactionStatus;
  try {
    const { userId, name } = req.user;
    const { accountNumber, transactionToken, amount } = req.body;

    const account = await getAccountByAccountNumber(accountNumber);

    if (account) {
      if (account.accountName !== name) {
        status = StatusCodes.UNAUTHORIZED;
        msg = "you are not authorized for this transaction";
        transactionStatus = TransactionStatus.DECLINE;
        throw new Error(msg);
      }
    } else {
      status = StatusCodes.NOT_FOUND;
      msg = "account does not exist";
      transactionStatus = TransactionStatus.DECLINE;
      throw new Error(msg);
    }

    const validateToken = await validateString(
      transactionToken,
      account.transactionToken
    );

    if (validateToken !== true) {
      status = StatusCodes.UNAUTHORIZED;
      msg = "incorrect token";
      throw new Error(msg);
    }

    account.balance = account.balance + amount;
    const updatedAccount = await accountRepository.save(account);
    transactionStatus = TransactionStatus.SUCCESS;

    await createTransactionReceipt(
      updatedAccount.owner,
      updatedAccount.accountNumber,
      updatedAccount,
      TransactionType.DEPOSIT,
      amount,
      transactionStatus
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        transaction_status: transactionStatus,
        balance: updatedAccount.balance,
      },
    });
  } catch (error) {
    console.log(error);
    transactonErrorResponse(status, msg, res);
  }
};

// @desc    Account check account balance
// @route   GET /account/check-balance
// @req.body nil
export const checkBalance = async (req: any, res: Response) => {
  try {
    const { account_number: accountNumber } = req.query;
    const user = await getUserById(req.user.userId);
    // const account = await getAccountByOwner(user);

    const account = await getAccountBalance(accountNumber);
    if (account.userId !== user.userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "access denied" })
    }

    return res
      .status(StatusCodes.OK)
      .json({ success: true, data: { balance: account.balance } });
  } catch (error) {
    console.log(error);
    let status = StatusCodes.INTERNAL_SERVER_ERROR;
    let message = "something went wrong";
    errorResponse(status, message, res);
  }
};

// // @desc    Account withdraw fund
// // @route   GET /account/withdraw
// // @req.body { "transaction_token": <<transaction token>>, "amount": <<amount>> }
// export const withdrawFunds = async (req: any, res: Response) => {
//   let status = StatusCodes.INTERNAL_SERVER_ERROR;
//   let msg = "something went wrong";
//   let transactionStatus: TransactionStatus;
//   try {
//     let { transaction_token, amount } = req.body;
//     const account = await getAccountByOwnerId(req.user.userId);
//     amount = parseInt(amount);

//     if (!account) {
//       status = StatusCodes.NOT_FOUND;
//       msg = "account not found";
//       throw new Error(msg);
//     }

//     const validateToken = await validateString(
//       transaction_token,
//       account?.getTransactionToken()!
//     );

//     if (validateToken !== true) {
//       status = StatusCodes.UNAUTHORIZED;
//       msg = "incorrect token";
//       throw new Error(msg);
//     }

//     if (account.getBalance() < amount) {
//       throw new Error("insufficient fund");
//     }

//     const newBalance = account.getBalance() - amount;
//     account.setBalance(newBalance);
//     const updatedAccount = await accountRepository.save(account);
//     transactionStatus = TransactionStatus.SUCCESS;

//     const user = await getUserById(req.user.userId);

//     await createTransactionReceipt(
//       user,
//       updatedAccount.accountNumber,
//       updatedAccount,
//       TransactionType.WITHDRAW,
//       amount,
//       transactionStatus
//     );

//     return res.status(StatusCodes.OK).json({
//       success: true,
//       data: { amount_withdrawn: amount, new_balance: newBalance },
//     });
//   } catch (error) {
//     console.log(error);
//     transactonErrorResponse(status, msg, res);
//   }
// };

// // @desc    Account transfer fund
// // @route   GET /account/transfer-fund
// // @req.body { "account_number: <<accountNumber>> }
// export const getAccount = async (req: any, res: Response) => {
//   let { account_number } = req.body;
//   const account = await getAccountByAccountNumber(account_number);

//   if (!account) {
//     return res
//       .status(StatusCodes.NOT_FOUND)
//       .json({ success: false, msg: "account not found" });
//   }

//   return res
//     .status(StatusCodes.NOT_FOUND)
//     .json({ success: false, data: { account_name: account.getAccountName() } });
// };

// // @desc    Account transfer fund
// // @route   GET /account/transfer-fund
// // @req.body { "recepient_accountNumber: <<recepient_accountNumber>>, ,"transaction_token": <<transaction token>>, "amount": <<amount>> }
// export const transferFunds = async (req: any, res: Response) => {
//   let status = StatusCodes.INTERNAL_SERVER_ERROR;
//   let msg = "something went wrong";
//   let transactionStatus: TransactionStatus;
//   try {
//     let { recepient_accountNumber, transaction_token, amount } = req.body;
//     amount = parseInt(amount);

//     const senderAccount: any = await getAccountByOwnerId(req.user.userId);
//     const receiverAccount: any = await getAccountByAccountNumber(
//       recepient_accountNumber
//     );

//     if (!senderAccount && !receiverAccount) {
//       status = StatusCodes.NOT_FOUND;
//       msg = "account not found";
//     }

//     const validateToken = await validateString(
//       transaction_token,
//       senderAccount.getTransactionToken()!
//     );

//     if (validateToken !== true) {
//       status = StatusCodes.UNAUTHORIZED;
//       msg = "incorrect token";
//       throw new Error(msg);
//     }

//     if (senderAccount.getBalance() < amount) {
//       throw new Error("insufficient fund");
//     }

//     // deduct transfer amount from sender account
//     const senderNewBalance = senderAccount.getBalance() - amount;
//     senderAccount.setBalance(senderNewBalance);
//     await accountRepository.save(senderAccount);

//     // add transfer amount to receiver account
//     receiverAccount.setBalance(receiverAccount.getBalance() + amount);

//     const updatedReceiverAccount = await accountRepository.save(
//       receiverAccount
//     );

//     transactionStatus = TransactionStatus.SUCCESS;

//     const user = await getUserById(req.user.userId);

//     await createTransactionReceipt(
//       user,
//       senderAccount.accountNumber,
//       updatedReceiverAccount,
//       TransactionType.TRANSFER,
//       amount,
//       transactionStatus
//     );

//     return res.status(StatusCodes.OK).json({
//       success: true,
//       data: {
//         amount_transfered: amount,
//         new_balance: senderNewBalance,
//         receiver_accountName: receiverAccount.accountName,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     transactonErrorResponse(status, msg, res);
//   }
// };
