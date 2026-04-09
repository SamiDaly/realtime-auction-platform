import type { AuctionForm } from "./AuctionForm";

export interface Auction extends AuctionForm {
  creator: string;
  highestBid: number;
  highestBidder: string;
  id: number;
  bids: Bid[];
}
