import express, { Request, Response, NextFunction } from "express";

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get("/", async (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).send("Bank API - Work in progress");
});

app.use((req: Request, res: Response) =>
  res.status(404).send("Route does not exist")
);

export { app };
