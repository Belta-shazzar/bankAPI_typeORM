import { StatusCodes } from 'http-status-codes';
import express, { Request, Response, NextFunction } from "express";
import route from "./routes";
// error handler
import { errorHandlerMiddleware } from "./middleware/error-handler";

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Routers
app.use("/api/v1", route);

app.use(errorHandlerMiddleware);

// Base route
app.get("/", async (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).send("Bank API - Work in progress");
});


app.use((req: Request, res: Response) =>
  res.status(StatusCodes.NOT_FOUND).send("Route does not exist")
);

export { app };
