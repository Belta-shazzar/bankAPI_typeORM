import "reflect-metadata";
import "dotenv/config";
import { app } from "./app";
import { AppDataSource } from "./config/data-source";

const PORT = process.env.APP_PORT || 5000;

const start = async () => {
  try {
    console.log(AppDataSource.isInitialized)
    await AppDataSource.initialize();
    console.log(AppDataSource.isInitialized);
    app.listen(PORT, () => {
      console.log(
        `server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
    });
  } catch (error) {
    console.log(error);
  }
};

start();
