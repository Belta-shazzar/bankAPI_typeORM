import { Request, Response, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import jwt, { Secret } from "jsonwebtoken"

const secretKey: Secret = process.env.JWT_SECRET!;

export const createJWT = (userID: number, userFullName: string) => {
    return jwt.sign(
      { userId: userID.toString(), name: userFullName },
      secretKey,
      {
        expiresIn: process.env.JWT_LIFETIME!,
      }
    );
}

export const jwtAuth = (req: any, res: Response, next: NextFunction) => {
  try {
    // check header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw new Error("Authenticaion Invalid");
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, secretKey);
    console.log(payload)
    req.user = payload;
    next();
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: "Authenticaion Invalid" });
  }
}