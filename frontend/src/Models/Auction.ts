import type { AuctionForm } from "./AuctionForm";
import type { Bid } from "./Bid";

export interface Auction extends AuctionForm {
  creator: string;
  highestBid: number;
  highestBidder: string;
  id: number;
  bids: Bid[];
}
