import { AuctionDto } from "./AuctionDTO.mts";

export type BidDTO = {
  bidder: string | null;
  amount: number | 0;
  // time: Date;
};
