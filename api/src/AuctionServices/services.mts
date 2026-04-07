import { AuctionDto } from "../DTOs/AuctionDTO.mts";
import { BidDTO } from "../DTOs/BidDTO.mts";
import Auction, { convertToAuctionDTO } from "../models/Auction.mts";
import { AuctionForm } from "../type/AuctionForm.mts";

export const createAuction = async (auction: AuctionForm) => {
  const theNewAuction = await Auction.create(auction);
  return convertToAuctionDTO(theNewAuction);
};

export const placeBid = async (auction: AuctionDto, bid: BidDTO) => {
  const theAuction = await Auction.findOne({ title: auction.title });

  if (!theAuction) {
    return "no such auction";
  }

  if (theAuction.creator === bid.bidder) {
    return "creator must not place a bid on their own item";
  }

  const auctionToDTO = convertToAuctionDTO(theAuction);
  const lastBid = auctionToDTO.bids[auctionToDTO.bids.length - 1];

  if (lastBid && bid.amount <= lastBid.amount) {
    return "bid must be higher than the previous bid";
  }

  theAuction.highestBid = bid.amount;
  theAuction.highestBidder = bid.bidder;
  theAuction.bids.push(bid);
  await theAuction.save();
  return auctionToDTO.bids;
};
