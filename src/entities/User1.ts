import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Account } from "./Account";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ name: "full_name" })
  fullName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Account, (account) => account.owner)
  accounts: Account;
}
