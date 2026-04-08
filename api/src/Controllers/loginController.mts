import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { convertToDto } from "../models/User.mts";

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user) return null;

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) return null;

  const token = jwt.sign({ username: user.username, email: user.email }, process.env.JWT_SECRET!, { expiresIn: "1h" });

  return { user: convertToDto(user), token };
};
// 1. Hämta user från DB via email
// 2. Kontrollera att user finns
// 3. Jämför lösenord med bcrypt.compare()
// 4. Skapa JWT token med username + email
// 5. Token signeras med JWT_SECRET
// 6. Returnera userinfo + token
