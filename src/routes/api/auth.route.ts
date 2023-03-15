import { validateSignInInput } from './../../middleware/input.validation';
import express from "express";
import { signUp, signIn } from "../../controllers/user.controller";

const route = express.Router();

route.post("/sign-up", validateSignInInput, signUp);
route.post("/sign-in", signIn);

export default route;
