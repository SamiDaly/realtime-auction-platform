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
import Auction, {
  auctionSchema,
  convertToAuctionDTO,
} from "./models/Auction.mts";
import { BidDTO } from "./DTOs/BidDTO.mts";
import {
  createAuction,
  getAuctions,
  placeBid,
} from "./AuctionServices/services.mts";
import { UserDto } from "./models/userDTO.mts";
import { log } from "node:console";
import { AuctionCollection } from "./models/AuctionCollection.mts";
//import type { UserDto } from "./models/userDto.mjs";
config();
const mongoUrl = process.env.MONGO_URI;
const port = process.env.PORT || 3000;

export const auctionRouter = express.Router();
if (!mongoUrl)
  throw new Error("Could not find connection string in the env file");

const app = express();
const server = createServer(app);

app.use(json());
app.use(cors());
app.use(cookieParser());

const auctions: AuctionDto[] = [];

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("getAuctions", async () => {
    const auctions = await getAuctions();
    socket.emit("postAuction", auctions);
  });

  // Socket som lyssnar när en användare ansluter till en auktion och lägger
  // till dem i rummet för den auktionen. När en användare lämnar en auktion
  // tas de bort från rummet. Då kan vi skicka uppdateringar om budgivning
  // och andra händelser i realtid till alla användare som är anslutna
  // till den specifika auktionen.
  socket.on("joinAuction", async (auctionId: string) => {
    socket.join(auctionId);
    //console.log(`${socket.data.user.username} gick med i auktion ${auctionId}`);
    console.log("användarnamn gick med i auktionen" + auctionId);

    const foundAuction = await Auction.findOne({ id: +auctionId });
    if (foundAuction) {
      const foundChat: BidDTO[] = foundAuction.bids;
      console.log("hittade chatten", foundChat);
      if (foundChat) {
        socket.emit("chatHistory", foundChat);
        // io.to(auctionId).emit("chatHistory", foundChat);
        console.log("id:", auctionId);
      }
    }
  });

  socket.on("leaveAuction", (auctionId: string) => {
    socket.leave(auctionId);
    console.log(`${socket.data.user.username} lämnade auktion ${auctionId}`);
  });

  //post i DB
  socket.on("createAuction", async (auctionForm: AuctionForm) => {
    const createdAuction = {
      id: Date.now(),
      title: auctionForm.title,
      img: auctionForm.img,
      description: auctionForm.description,
      startPrice: auctionForm.startPrice,
      highestBid: 0,
      creator: socket.data.username || "andrea",
      highestBidder: null,
      endDateTime: auctionForm.endDateTime,
      status: auctionForm.status,
      bids: [],
    } satisfies AuctionDto;

    await createAuction(createdAuction);

    const auctions = await getAuctions();

    socket.emit("postAuction", auctions);
  });

  socket.on("place bid", async (auctionId: number, bid: BidDTO) => {
    bid.bidder = "sara";
    const auction = await Auction.findOne({ id: auctionId });
    console.log(auction);
    if (!auction) return;
    auction.bids.push(bid);

    const auctionDTO = convertToAuctionDTO(auction);
    const newBid = await placeBid(auctionDTO, bid);

    console.log("Nytt bud:", newBid);
    //io.to(auction.id.toString()).emit("NewBid", newBid);
    //socket.emit("NewBid", newBid);
    io.to(auctionId.toString()).emit("NewBid", bid);
    console.log("budid:", auctionId);
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
