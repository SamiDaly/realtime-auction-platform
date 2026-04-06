import { AuctionDto } from "./AuctionDTO.mts";
import { BidderDTO } from "./BidderDTO.mts";

export type BidDTO = {
  amount: number;
  bidder: BidderDTO;
  timestamp: Date;
};
/**
 *   bidder: { type: Schema.Types.ObjectId, ref: "Bidder" },
     auction: { type: Schema.Types.ObjectId, ref: "Auction" },
     amount: { type: Number },
 */
