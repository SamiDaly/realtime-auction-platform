import { BidderDTO } from "./BidderDTO.mts";
import { BidDTO } from "./BidDTO.mts";

export type AuctionDto = {
  title: string;
  description: string;
  startPrice: number;
  highestBid: number;
  creator: BidderDTO;
  highestBidder: BidderDTO;
  endTime: Date;
  status: "active" | "ended";
  bids: BidDTO[];
};
