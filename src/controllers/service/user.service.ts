import { AppDataSource } from "../../config/data-source";
import { User } from "../../entities/User";

const userRepository = AppDataSource.getRepository(User);

export const getUserByMail = async (email: string) => {
  return await userRepository.findOneBy({ email: email });
};

export const getUserById = async (id: number) => {
  const user = await userRepository.findOneBy({ userId: id });

  if (!user) {
    throw new Error("user not found");
  }
  return user;
};
