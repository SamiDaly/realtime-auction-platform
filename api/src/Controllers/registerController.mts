import bcrypt from "bcryptjs";
import User from "../models/User.mts";
import { convertToDto } from "../models/User.mts";
import jwt from "jsonwebtoken";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const createdUser = await User.create({
    username: name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    { username: createdUser.username, email: createdUser.email },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1h",
    },
  );
  return { userDto: convertToDto(createdUser), token };
};
// 1. Skapar salt med bcrypt
// 2. Hashar lösenordet
// 3. Skapar nytt user-objekt
// 4. Sparar användaren i MongoDB
// 5. Returnerar säker användardata (DTO)
