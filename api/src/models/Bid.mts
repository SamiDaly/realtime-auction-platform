import { Schema } from "mongoose";
import type { InferSchemaType } from "mongoose";
import type { BidDTO } from "../DTOs/BidDTO.mts";

// Schema som beskriver en budgivning, med fält för belopp och budgivare.
// Tidsstämplar används för att hålla reda på när budet lades,
// men inte när det uppdaterades, eftersom budet inte kan ändras efter att det lagts.
export const bidSchema = new Schema(
  {
    amount: { type: Number, required: true },
    bidder: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "time", updatedAt: false },
  },
);
type BidDbType = InferSchemaType<typeof bidSchema>;

export const convertToBidDTO = (bid: BidDbType): BidDTO => {
  return {
    amount: bid.amount,
    bidder: bid.bidder,
    //time: bid.time,
  } satisfies BidDTO;
};
