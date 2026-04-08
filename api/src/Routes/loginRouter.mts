import express from "express";
import { loginUser } from "../Controllers/loginController.mts";

export const loginRouter = express.Router();

loginRouter.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }
  try {
    const result = await loginUser(email, password);

    if (!result) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    res.cookie("login", result.token, {
      expires,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.status(200).json({ user: result.user, token: result.token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
// 1. Tar emot email + password
// 2. Validerar att fälten finns
// 3. Anropar loginUser()
// 4. Skapar cookie med JWT-token
// 5. Returnerar userDTO + token
