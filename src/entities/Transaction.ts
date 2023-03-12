import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { MinLength, IsEmail } from "class-validator";
import { User } from "./User";

@Entity("transaction_receipt")
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  author: User;

  @Column({ name: "author_account_number" })
  authorAccountNumber: string;

  @Column({ name: "receiver_account_number" })
  receiverAccountNumber: string;

  @Column({ name: "transaction_type" })
  transactionType: string;

  @Column({ name: "status", default: true })
  transactionStatus: boolean;

  @Column()
  amount: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}