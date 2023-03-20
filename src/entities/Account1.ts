import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @ManyToOne(() => User, (user) => user.account)
  @JoinColumn({ name: "owner_id" })
  owner: User;

  @Column({ name: "account_name" })
  accountName: string;

  @Column({ name: "account_number", unique: true })
  readonly accountNumber: string;

  @Column({ name: "account_balance", default: 0.0 })
  balance: number;

  @Column({ name: "transaction_token" })
  transactionToken: string;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  readonly created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updated_at: Date;
}
