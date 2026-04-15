import type { AuctionForm } from "./Models/AuctionForm";

import type { Bid } from "./Models/Bid";

export const placebid = (msgInput: HTMLInputElement) => {
  const newBid = {
    bidder: "",
    amount: parseInt(msgInput.value),
    time: new Date(),
  } satisfies Bid;

  return newBid;
};

export const createAuction = (
  title: string,
  img: string,
  description: string,
  startPrice: number,
  MinutesFromNow: Date,
) => {
  const theNewAuction = {
    title,
    img,
    description,
    startPrice,
    endDateTime: MinutesFromNow.toISOString(),
  } satisfies AuctionForm;
  return theNewAuction;
};

export const calculateMinsFromNow = (endTime: string) => {
  const MINUTE = 60000;
  return new Date(Date.now() + parseInt(endTime) * MINUTE);
};
