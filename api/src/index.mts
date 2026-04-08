import express, { json } from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
//import type { Message } from "@sebastiantegel/edutypes";
import { config } from "dotenv";
import mongoose from "mongoose";
//import Chat from "./models/chatSchema.mjs";
import { registerRouter } from "./Routes/registerRouter.mts";
import { loginRouter } from "./Routes/loginRouter.mts";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import type { AuctionDto } from "./DTOs/AuctionDTO.mts";
import type { AuctionForm } from "./type/AuctionForm.mts";
import Auction, { auctionSchema, convertToAuctionDTO } from "./models/Auction.mts";
import { BidDTO } from "./DTOs/BidDTO.mts";
import { createAuction, placeBid } from "./AuctionServices/services.mts";
import type { UserDto } from "./DTOs/userDTO.mts";
import { log } from "node:console";

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

app.use("/api/auth", registerRouter);
app.use("/api/auth", loginRouter);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    socket.data.user = decoded;

    next();
  } catch (error) {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log("a user connected");

  //post i DB
  socket.on("createAuction", async (auction: AuctionDto) => {
    auction.creator = socket.data.username;
    const theNewAuction = await createAuction(auction);
    console.log(theNewAuction);
    // gör om till dto, lägg thenewAuction i en lista
    socket.emit("postAuction", theNewAuction);
  });

  socket.on("place bid", async (auction: AuctionDto, bid: BidDTO) => {
    bid.bidder = socket.data.user.username;

    const bids = await placeBid(auction, bid);
    socket.emit("displayBids", bids);
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
