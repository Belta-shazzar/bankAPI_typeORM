import express from "express";
import {
  createAccount,
    fundAccount,
  //   withdrawFunds,
  //   transferFunds,
    checkBalance,
  //   getAccount,
} from "../../controllers/account.controller";
import { jwtAuth } from "../../middleware/jwt.setup";

const route = express.Router();

route.post("/create-account", jwtAuth, createAccount);
route.post("/fund-account", jwtAuth, fundAccount)
// route.get("/withdraw", jwtAuth, withdrawFunds)
// route.get("/check-account", jwtAuth, getAccount);
// route.post("/transfer-fund", jwtAuth, transferFunds)
route.get("/check-balance", jwtAuth, checkBalance)

export default route;
