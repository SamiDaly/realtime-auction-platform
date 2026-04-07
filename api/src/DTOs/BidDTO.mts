import { AuctionDto } from "./AuctionDTO.mts";

export type BidDTO = {
  bidder: string;
  amount: number;
  time: Date;
};
