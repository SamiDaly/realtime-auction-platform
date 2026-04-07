import bcrypt from "bcryptjs";
import User, { convertToDto } from "../models/userSchema.mts";

export const registerUser = async (name: string, email: string, password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = {
    username: name,
    email,
    password: hashedPassword,
  };

  const createdUser = await User.create(newUser);

  return { userDto: convertToDto(createdUser), token };
};
//säkrat lösen hash+ salt
//skapar nyttt objekt
// sparas i DB
// return secure info
