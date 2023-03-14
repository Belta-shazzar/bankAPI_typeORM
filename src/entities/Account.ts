import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { MinLength } from "class-validator";
import { User } from "./User";

@Entity("account")
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @OneToOne(() => User, (owner) => owner.account, { cascade: true })
  @JoinColumn({ name: "owner_id" })
  public owner: User;

  @Column({ name: "account_name" })
  @MinLength(3, { message: "account name is too short" })
  private accountName: string;

  @Column({ name: "account_number", unique: true })
  readonly accountNumber: string;

  @Column({ name: "account_balance", default: 0.0 })
  private balance: number;

  @Column({ name: "transaction_token" })
  private transationToken: string;

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
    tToken: string
  ) {
    super();
    this.owner = owner;
    this.accountName = accountName;
    this.accountNumber = accountNumber;
    this.transationToken = tToken;
  }

  public getId(): number {
    return this.id;
  }

  public getOwner(): User {
    return this.owner;
  }

  public setAccountName(accountName: string) {
    this.accountName = accountName;
  }

  public getAccountName(): string {
    return this.accountName;
  }

  public setBalance(balance: number) {
    this.balance = balance;
  }

  public getBalance(): number {
    return this.balance;
  }

  public setTransactionToken(tToken: string) {
    this.transationToken = tToken;
  }

  public getTransactionToken(): string {
    return this.transationToken;
  }
}
