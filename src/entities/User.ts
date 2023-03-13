import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { MinLength, IsEmail } from "class-validator";
import { Account } from "./Account";

@Entity("user")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ name: "full_name" })
  @MinLength(3, { message: "please enter full name" })
  private fullName: string;

  @Column({ unique: true })
  @IsEmail()
  private email: string;

  @Column()
  private password: string;

  @OneToOne(() => Account, (account) => account.owner, {
    eager: true,
  })
  @JoinColumn({ name: "account_id" })
  public account: Account;

  constructor(fullName: string, email: string, password: string) {
    super();
    this.fullName = fullName;
    this.email = email;
    this.password = password;
  }

  public getId(): number {
    return this.id;
  }

  public setFullName(fullName: string) {
    this.fullName = fullName;
  }

  public getFullName(): string {
    return this.fullName;
  }

  public setEmail(email: string) {
    this.email = email;
  }

  public getEmail(): string {
    return this.email;
  }

  public setPassword(password: string) {
    this.password = password;
  }

  public getPassword(): string {
    return this.password;
  }

  public setAccount(account: Account) {
    this.account = account;
  }

  public getAccount(): Account {
    return this.account;
  }
}
