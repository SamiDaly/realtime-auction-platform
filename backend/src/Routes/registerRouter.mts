import express from "express";
import { registerUser } from "../Controllers/registerController.mts";

export const registerRouter = express.Router();

registerRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "missing in fields" });
    }

    const { userDto, token } = await registerUser(name, email, password);

    res.status(201).json({ user: userDto, token });
  } catch (error) {
    res.status(500).json({ message: "error", error });
  }
});
