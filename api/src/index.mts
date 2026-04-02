import express, { json } from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
//import type { Message } from "@sebastiantegel/edutypes";
import { config } from "dotenv";
import mongoose from "mongoose";
//import Chat from "./models/chatSchema.mjs";
//import registerRouter from "./routes/register.mjs";
//import { loginRouter } from "./routes/login.mjs";
import cookieParser from "cookie-parser";
import cookie from "cookie";
import jwt from "jsonwebtoken";
//import type { UserDto } from "./models/userDto.mjs";
config();
const mongoUrl = process.env.MONGO_URI;
const port = process.env.PORT;

if (!mongoUrl)
  throw new Error("Could not find connection string in the env file");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(json());
app.use(cors());
app.use(cookieParser());

//app.use("/api/register", registerRouter);
//app.use("/api/login", loginRouter);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, async () => {
  try {
    await mongoose.connect(mongoUrl);
  } catch (error) {
    console.error("Could not connect to database:", error);
  }
  console.log("Api is running on port 3000");
});
