import express, { json } from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import { config } from "dotenv";
import mongoose from "mongoose";
import { registerRouter } from "./Routes/registerRouter.mts";
import { loginRouter } from "./Routes/loginRouter.mts";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import type { AuctionForm } from "./type/AuctionForm.mts";
import type { AuctionDto } from "./DTOs/AuctionDTO.mts";
import type { BidDTO } from "./DTOs/BidDTO.mts";
import Auction, { convertToAuctionDTO } from "./models/Auction.mts";
import { createAuction, getAuctions, placeBid } from "./AuctionServices/services.mts";
import { bidSchema, convertToBidDTO } from "./models/Bid.mts";

config();

const mongoUrl = process.env.MONGO_URI;
const port = process.env.PORT || 3000;
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

// Socket auth — verifierar JWT vid anslutning
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Unauthorized"));
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    socket.data.user = decoded;

    console.log("socket auth successful for user:", socket.data.user.username);
    next();
  } catch (error) {
    next(new Error("Invalid token"));
  }
});

// Alla socket-events här
io.on("connection", (socket) => {
  console.log("a user connected");

  function endAuction(auctionId: string) {
    (async () => {
      const auction = await Auction.findOne({ id: +auctionId });

      if (!auction) return;

      if (auction.bids.length === 0) {
        io.to(auctionId.toString()).emit("displayWinner", {
          ...auction.toObject(),
          highestBidder: "No bids",
        });
        await auction.save();
        return;
      }

      const highestBid = auction.bids.reduce((max, bid) => (bid.amount > max.amount ? bid : max));

      console.log("vinnare:", highestBid);
      auction.highestBidder = highestBid.bidder;
      auction.highestBid = highestBid.amount;

      await auction.save();
      console.log("rum jag är med i " + socket.rooms); //ser vilka rum som klienten är med i

      io.to(auctionId).emit("displayWinner", auction);
      socket.emit("displayWinner", auction);
    })();
  }

  socket.on("getAuctions", async () => {
    const auctions = await getAuctions();
    console.log("Antal auktioner:", auctions.length);
    socket.emit("postAuction", auctions);
  });

  socket.on("joinAuction", async (auctionId: string) => {
    socket.join(auctionId);

    //console.log(`${socket.data.user.username} gick med i auktion ${auctionId}`);
    console.log(socket.data.user.username + " gick med i auktionen" + auctionId);

    const foundAuction = await Auction.findOne({ id: +auctionId });
    if (foundAuction) {
      const foundChat: BidDTO[] = foundAuction.bids;
      // console.log("hittade chatten", foundChat);
      if (foundChat) {
        io.to(auctionId.toString()).emit("chatHistory", foundChat);
        //socket.emit("chatHistory", foundChat);
      }
    }
  });

  socket.on("leaveAuction", (auctionId: string) => {
    socket.leave(auctionId);

    console.log(`${socket.data.user.username} lämnade auktion ${auctionId}`);
  });

  socket.on("createAuction", async (auctionForm: AuctionForm) => {
    const createdAuction = {
      id: Date.now(),
      title: auctionForm.title,
      img: auctionForm.img,
      description: auctionForm.description,
      startPrice: auctionForm.startPrice,
      highestBid: 0,
      creator: socket.data.user.username,
      highestBidder: null,
      endDateTime: auctionForm.endDateTime,
      status: "active",
      bids: [],
    } satisfies AuctionDto;

    /*console.log(
      "skapare av auktion:",
      createdAuction.creator,
      auctionForm.title,
    );*/
    await createAuction(createdAuction);

    const timeLeft = new Date(createdAuction.endDateTime).getTime() - Date.now();

    if (timeLeft > 0) {
      setTimeout(() => {
        endAuction(createdAuction.id.toString());
      }, timeLeft);
    }

    const auctions = await getAuctions();
    socket.emit("postAuction", auctions);
  });

  socket.on("place bid", async (auctionId: string, bid: BidDTO) => {
    bid.bidder = socket.data.user.username;
    console.log("budare:", socket.data.user.username);
    console.log("budare:", bid.bidder);
    const auction = await Auction.findOne({ id: +auctionId });

    if (!auction) return;
    // auction.bids.push(bid);

    const auctionDTO = convertToAuctionDTO(auction);
    const newBid = await placeBid(auctionDTO, bid);

    io.to(auctionId.toString()).emit("NewBid", newBid);
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
