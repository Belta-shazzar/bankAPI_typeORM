import express from "express";
import { signUp, signIn } from "../../controllers/user.controller";

const route = express.Router();

route.post("/sign-up", signUp);
route.post("/sign-in", signIn);

export default route;
