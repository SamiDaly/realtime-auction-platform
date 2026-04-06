import bcrypt from "bcryptjs";
import { hash } from "crypto";

export const registerUser = async (name: string, email: string, password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = {
    // _userId: new Date().getTime().toString(),
    name,
    email,
    password: hashedPassword,
  };
  const createdUser = await userModel.create(newUser);

  return convertDbUserToDto(createdUser);
};
