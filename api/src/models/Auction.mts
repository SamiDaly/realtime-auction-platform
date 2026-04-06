import mongoose, { InferSchemaType, model, Schema } from "mongoose";
import { AuctionDto } from "../DTOs/AuctionDTO.mts";
import { BidDTO } from "../DTOs/BidDTO.mts";
import { BidderDTO } from "../DTOs/BidderDTO.mts";
//import { BidderSchema } from "./Bidder.mts";
//import { BidSchema } from "./Bid.mts";

export const auctionSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startPrice: { type: Number, required: true },
    highestBid: { type: Number, default: 0 },
    // creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creator: { type: BidderSchema, required: true },
    // highestBidder: { type: Schema.Types.ObjectId, ref: "User", default: null },
    highestBidder: { type: BidderSchema, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ["active", "ended"], default: "active" },
    //bids: { type: [Schema.Types.ObjectId], ref: "Bid", default: [] },
    bids: [BidSchema],
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
    description: auction.description,
    startPrice: auction.startPrice,
    highestBid: auction.highestBid,
    creator: auction.creator,
    highestBidder: auction.highestBidder,
    endTime: auction.endTime,
    status: auction.status,
    bids: auction.bids.map((bid: BidDTO) => {
      return {
        amount: bid.amount,
        bidder: bid.bidder,
        timestamp: bid.timestamp,
      } satisfies BidDTO;
    }),
  } satisfies AuctionDto;
};
