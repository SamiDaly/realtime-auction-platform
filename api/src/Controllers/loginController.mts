import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { convertToDto } from "../models/User.mts";
//import User, { convertToDto } from "../models/userSchema.mts";

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user) return null;

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) return null;

  const token = jwt.sign({ username: user.username, email: user.email }, process.env.JWT_SECRET!, { expiresIn: "1h" });

  return { user: convertToDto(user), token };
};
// hämta användare från DB med emale
//jämför lösen med hashed lösen i DBlkkjhgv
//JWT token användar info
//return token och användar info
