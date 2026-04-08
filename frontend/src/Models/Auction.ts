import type { AuctionForm } from "./AuctionForm";
import type { Bid } from "./Bid";

/*export type Auction extends AuctionForm  {
  // auctionForm: AuctionForm;
  title: string;
  img: string;
  description: string;
  startPrice: number;
  endDateTime: Date;
  status: "active" | "ended";
  bids: Bid[] | [];
  highestBid: number;
  creator: string;
  highestBidder: string;
};*/

export interface Auction extends AuctionForm {
  creator: string;
  highestBid: number;
  highestBidder: string;
}
