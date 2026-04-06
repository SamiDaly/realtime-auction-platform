import express from "express";

export const loginRouter = express.Router();

loginRouter.post("/login", (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "missing in fields" });
    }
    res.status(200).json({ message: "ok" });
  } catch (error) {
    res.status(500).json({ message: "missing object" });
  }
});
