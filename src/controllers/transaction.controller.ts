import { Request, Response } from "express";
import { Transaction } from "../entities/Transaction";

export const getAllTransactionReceipt = async (req: Request, res: Response) => {
  console.log("All your transactions...");
  console.log();
};

export const getATransactionReceipt = async (req: Request, res: Response) => {
  console.log("One of your transactions...");
  console.log();
};