import type { BidDTO } from "./BidDTO.mts";

export type AuctionDto = {
  id: number;
  title: string;
  img: string;
  description: string;
  startPrice: number;
  highestBid: number;
  creator: string | null | undefined;
  highestBidder: string | null | undefined;
  endDateTime: Date;
  status: "active" | "ended";
  bids: BidDTO[];
};
