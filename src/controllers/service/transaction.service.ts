import { TransactionType, TransactionStatus } from "./../../util/enums";
import { User } from "../../entities/User";
import { Account } from "../../entities/Account";
import { Transaction } from "../../entities/Transaction";
import { AppDataSource } from "../../config/data-source";

const transactionRepository = AppDataSource.getRepository(Transaction)

export const createTransactionReceipt = async (
  author: User,
  authorAN: string,
  receiver: Account,
  tType: TransactionType,
  amount: number,
  status: TransactionStatus
) => {
  try {

    const transaction = new Transaction(
      author,
      authorAN,
      receiver,
      tType,
      amount,
      status
    ).save();
  } catch (error) {
    console.log(error)
  }
};

export const getAccountByOwnerId = async (authorId: number) => {
  return await transactionRepository
    .createQueryBuilder("transaction")
    .where("transaction.authorId = :id", { id: authorId })
    .getMany();
};
