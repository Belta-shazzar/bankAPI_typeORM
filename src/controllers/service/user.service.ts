import { AppDataSource } from "../../config/data-source";
import { User } from "../../entities/User";

const userRepository = AppDataSource.getRepository(User);

export const getUserByMail = async (email: string) => {
  return await userRepository
    .createQueryBuilder("user")
    .where("user.email = :email", { email })
    .getOne();
};

export const getUserById = async (id: number) => {
  const user = await userRepository
    .createQueryBuilder("user")
    .where("user.id = :id", { id: id })
    .getOne();

  if (!user) {
    throw new Error("user not found");
  }
  return user;
};
