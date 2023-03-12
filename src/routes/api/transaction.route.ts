import express from "express";
import {
    getAllTransactionReceipt,
    getATransactionReceipt,
} from "../../controllers/transaction.controller";
import { jwtAuth } from './../../middleware/jwt.setup';

const route = express.Router();

route.get("/", jwtAuth, getAllTransactionReceipt);
route.get("/:id", jwtAuth, getATransactionReceipt);

export default route;
