import { Request, Response } from "express";
import { Account } from "../entities/Account";
import { createAccount } from "./service/account.service";

export const fundAccount = async (req: Request, res: Response) => {
  console.log("Account funded");
  console.log();
};

export const checkBalance = async (req: Request, res: Response) => {
  console.log("Your balance...");
  console.log();
};

export const withdrawFunds = async (req: Request, res: Response) => {
  console.log("Account Debited");
  console.log();
};

export const transferFunds = async (req: Request, res: Response) => {
  console.log("Transfer successful");
  console.log();
};
