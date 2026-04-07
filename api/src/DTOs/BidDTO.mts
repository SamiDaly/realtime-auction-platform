import { AuctionDto } from "./AuctionDTO.mts";

export type BidDTO = {
  bidder: string;
  amount: number;
  time: Date;
};
/**
 *   bidder: { type: Schema.Types.ObjectId, ref: "Bidder" },
     auction: { type: Schema.Types.ObjectId, ref: "Auction" },
     amount: { type: Number },
 */
