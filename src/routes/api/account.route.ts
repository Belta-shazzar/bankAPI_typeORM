import express from "express";
import {
  fundAccount,
  withdrawFunds,
  transferFunds,
  checkBalance,
} from "../../controllers/account.controller";
import { jwtAuth } from "../../middleware/jwt.setup";

const route = express.Router()

route.post("/fund-account", jwtAuth, fundAccount)
route.get("/withdraw", jwtAuth, withdrawFunds)
route.post("/transfer-fund", jwtAuth, transferFunds)
route.get("/check-balance", jwtAuth, checkBalance)

export default route;
