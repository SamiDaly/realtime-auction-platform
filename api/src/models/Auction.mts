import { InferSchemaType, model, Schema } from "mongoose";
import { AuctionDto } from "../DTOs/AuctionDTO.mts";
import { BidDTO } from "../DTOs/BidDTO.mts";
import { bidSchema } from "./Bid.mts";

export const auctionSchema = new Schema(
  {
    id: { type: Number, required: true },
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

// Statisk metod för att stänga alla utgångna auktioner
auctionSchema.statics.closeExpired = async function () {
  const result = await this.updateMany(
    { status: "active", endDateTime: { $lte: new Date() } }, // Hitta alla aktiva auktioner som har passerat sitt slutdatum
    { status: "ended" },
  );
  return result.modifiedCount; // Returnera antalet uppdaterade dokument
};

const Auction = model("Auction", auctionSchema);

export default Auction;
type AuctionDbType = InferSchemaType<typeof auctionSchema>;

export const convertToAuctionDTO = (auction: AuctionDbType): AuctionDto => {
  return {
    id: auction.id,
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
