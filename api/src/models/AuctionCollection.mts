import { model, Schema } from "mongoose";
import { auctionSchema } from "./Auction.mts";

/*export const auctionCollectionSchema = new Schema({
  auctions: [auctionSchema],
});
*/
export const AuctionCollection = model("Auction", auctionSchema);
