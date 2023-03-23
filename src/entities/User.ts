import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Account } from "./Account";

@Entity()
export class User {
  @PrimaryGeneratedColumn({ name: "user_id" })
  readonly userId: number;

  @Column({ name: "full_name" })
  fullName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Account, (account) => account.owner)
  accounts: Account;

  constructor(fullName: string, email: string, password: string) {
    this.fullName = fullName;
    this.email = email;
    this.password = password;
  }
}
