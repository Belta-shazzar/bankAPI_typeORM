import "reflect-metadata";
import { DataSource } from "typeorm";
import { Account } from "../entities/Account";
import { Transaction } from "../entities/Transaction";
import { User } from "../entities/User";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Account, Transaction],
  synchronize: true
});