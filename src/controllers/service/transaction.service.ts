import { TransactionType, TransactionStatus } from "./../../util/enums";
import { User } from "../../entities/User";
import { Account } from "../../entities/Account";

export const createTransactionReceipt = async (
  author: User,
  authorAN: string,
  receiver: Account,
  tType: TransactionType,
  status: TransactionStatus,
  amount: number
) => {};
