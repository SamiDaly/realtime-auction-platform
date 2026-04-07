import mongoose, { InferSchemaType, model, Schema } from "mongoose";
import { AuctionDto } from "../DTOs/AuctionDTO.mts";
import { BidDTO } from "../DTOs/BidDTO.mts";
import { bidSchema } from "./Bid.mts";

export const auctionSchema = new Schema(
  {
    title: { type: String, required: true },
    img: { type: String, required: true },
    description: { type: String, required: true },
    startPrice: { type: Number, required: true },
    highestBid: { type: Number, default: 0 },
    creator: { type: String, required: true },
    highestBidder: { type: String, required: false },
    endDateTime: { type: Date, required: true },
    status: { type: String, enum: ["active", "ended"], default: "active" },
    bids: { type: [bidSchema], default: [] },
  },
  {
    timestamps: true,
  },
);

const Auction = model("Auction", auctionSchema);

export default Auction;
type AuctionDbType = InferSchemaType<typeof auctionSchema>;

export const convertToAuctionDTO = (auction: AuctionDbType): AuctionDto => {
  return {
    title: auction.title,
    img: auction.img,
    description: auction.description,
    startPrice: auction.startPrice,
    highestBid: auction.highestBid,
    creator: auction.creator,
    highestBidder: auction.highestBidder,
    endDateTime: auction.endDateTime,
    status: auction.status,
    bids: (auction.bids as unknown as BidDTO[]).map((bid) => ({
      amount: bid.amount,
      bidder: bid.bidder,
      time: bid.time,
    })),
  };
};
