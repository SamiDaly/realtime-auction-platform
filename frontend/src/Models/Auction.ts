import type { Bid } from "./Bid";

export type Auction = {
  title: string;
  img: string;
  description: string;
  startPrice: number;
  highestBid: number | null | undefined;
  creator: string | null | undefined;
  highestBidder: string | null | undefined;
  endDateTime: Date;
  status: "active" | "ended";
  bids: Bid[] | [];
};
