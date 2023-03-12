import { Account } from './Account';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { TransactionType, TransactionStatus } from "../util/enums";
import { User } from "./User";

@Entity("transaction_receipt")
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @ManyToOne(() => User)
  readonly author: User;

  @Column({ name: "author_account_number" })
  readonly authorAccountNumber: string;

  @ManyToOne(() => Account)
  readonly receiver: Account;

  @Column({ name: "transaction_type", type: "enum", enum: TransactionType })
  readonly transactionType: TransactionType;

  @Column({
    name: "status",
    type: "enum",
    enum: TransactionStatus,
    default: TransactionStatus.SUCCESS,
  })
  private transactionStatus: TransactionStatus;

  @Column()
  readonly amount: number;

  @CreateDateColumn()
  private created_at: Date;

  @UpdateDateColumn()
  private updated_at: Date;

  constructor(
    authorID: User,
    authorAN: string,
    receiver: Account,
    transactionType: TransactionType,
    amount: number
  ) {
    super();
    this.author = authorID;
    this.authorAccountNumber = authorAN;
    this.receiver = receiver;
    this.transactionType = transactionType;
    this.amount = amount;
  }
}
