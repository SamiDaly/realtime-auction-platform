import type { AuctionForm } from "./AuctionForm";

export type Auction = {
  auctonForm: AuctionForm;
  highestBid: number | null | undefined;
  creator: string | null | undefined;
  highestBidder: string | null | undefined;
};
