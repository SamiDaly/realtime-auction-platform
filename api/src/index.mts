import express, { json } from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
//import type { Message } from "@sebastiantegel/edutypes";
import { config } from "dotenv";
import mongoose from "mongoose";
//import Chat from "./models/chatSchema.mjs";
import { registerRouter } from "./Routes/registerRouter.mjs";
import { loginRouter } from "./Routes/loginRouter.mjs";
import cookieParser from "cookie-parser";
import cookie from "cookie";
import jwt from "jsonwebtoken";
//import type { UserDto } from "./models/userDto.mjs";

config();

const port = process.env.PORT || "";
const mongoUrl = process.env.mongoUrl || "";
if (mongoUrl === "") {
  throw "not exist";
}

const app = express();

//app.use(coockieParser());

app.use(json());

//app.use(cors());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/register", registerRouter);
app.use("/login", loginRouter);

loginRouter.get("/", (req, res) => {
  res.status(200).json({ message: "bravisimo login " });
});
registerRouter.get("/", (req, res) => {
  res.status(200).json({ message: "bravisimo register" });
});

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

//chatIo(io);

server.listen(port, async () => {
  try {
    await mongoose.connect(mongoUrl);

    console.log(`API is running on port ${port}`);
  } catch (error) {
    console.error(" connection error:", error);
  }
});
