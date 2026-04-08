export type AuctionForm = {
  title: string;
  img: string;
  description: string;
  startPrice: number;
  endDateTime: Date;
  // status: "active" | "ended"; // tror inte behövs, servern kan avgöra detta baserat på endDateTime
  // bids: Bid[] | [];
};
