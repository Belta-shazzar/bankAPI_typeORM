import { Account } from "./Account";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { MinLength } from "class-validator";
import { User } from "./User";

@Entity("account")
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: "owner_id" })
  readonly owner: User;

  @Column({ name: "account_name" })
  @MinLength(3, { message: "account name is too short" })
  private accountName: string;

  @Column({ name: "account_number", unique: true })
  readonly accountNumber: string;

  @Column()
  private balance: number;

  @Column({ name: "transaction_token" })
  private transationToken: number;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  private created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  private updated_at: Date;

  constructor(
    owner: User,
    accountName: string,
    accountNumber: string,
    balance: number,
    tToken: number
  ) {
    super();
    this.owner = owner;
    this.accountName = accountName;
    this.accountNumber = accountNumber;
    this.balance = balance;
    this.transationToken = tToken;
  }
}
