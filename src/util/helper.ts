import bcrypt from "bcryptjs";

export const encryptString = async (toEncrypt: string) => {
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_GENSALT!));
  return (toEncrypt = await bcrypt.hash(toEncrypt, salt));
};

export const validateString = async (
  toValidate: string,
  actualValue: string
) => {
  return await bcrypt.compare(toValidate, actualValue);
};

export const generateNumber = (rangeLength: number) => {
  return Math.floor(10 + Math.random() * rangeLength);
};
