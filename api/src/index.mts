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
import { AuctionDto } from "./DTOs/AuctionDTO.mts";
import { AuctionForm } from "./type/AuctionForm.mts";
import Auction, { auctionSchema } from "./models/Auction.mts";
//import type { UserDto } from "./models/userDto.mjs";
config();
const mongoUrl = process.env.MONGO_URI;
const port = process.env.PORT || 3000;

export const auctionRouter = express.Router();
if (!mongoUrl) throw new Error("Could not find connection string in the env file");

const app = express();
const server = createServer(app);

app.use(json());
app.use(cors());
app.use(cookieParser());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

//app.use("/api/register", registerRouter);
//app.use("/api/login", loginRouter);

io.on("connection", (socket) => {
  console.log("a user connected");

  //post i DB
  socket.on("createAuction", async (auction: AuctionForm) => {
    const theNewAuction = await Auction.create(auction);
    console.log("auktion", theNewAuction);
    socket.emit("postAuction", theNewAuction);
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
