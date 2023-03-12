import express from "express";
import authRoute from "./api/auth.route"
import accountRoute from "./api/account.route"
import transactionRoute from "./api/transaction.route"

const route = express.Router()

route.use("/auth", authRoute)
route.use("/account", accountRoute)
route.use("/transaction", transactionRoute)

export default route;