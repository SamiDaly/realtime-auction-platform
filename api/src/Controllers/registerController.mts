import bcrypt from "bcryptjs";
import User from "../models/User.mts";
import { convertToDto } from "../models/User.mts";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = {
    username: name,
    email,
    password: hashedPassword,
  };

  const createdUser = await User.create(newUser);

  return convertToDto(createdUser);
};
//säkrat lösen hash+ salt
//skapar nyttt objekt
// sparas i DB
// return secure info
