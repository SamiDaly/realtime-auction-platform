import { Schema } from "mongoose";

export const bidSchema = new Schema(
  {
    amount: { type: Number, required: true },
    bidder: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "time", updatedAt: false },
  }
);