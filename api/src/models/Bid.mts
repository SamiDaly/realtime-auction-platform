import { Schema } from "mongoose";

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
  }
);