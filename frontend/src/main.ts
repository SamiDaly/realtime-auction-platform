import type { Auction } from "./Models/Auction";
import "./style.css";

import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  withCredentials: true,
});

//inlogg logik

socket.on("connect", () => {
  console.log("socket:", socket.connected);
  document.getElementById("auctionForm")?.addEventListener("submit", (e) => {
    e.preventDefault();

    //hämta värden
    const title = (document.getElementById("title") as HTMLInputElement).value;
    const img = (document.getElementById("img") as HTMLInputElement).value;
    const description = (
      document.getElementById("description") as HTMLTextAreaElement
    ).value;
    const startPrice = parseInt(
      (document.getElementById("startPrice") as HTMLInputElement).value,
    );

    const endDate = (document.getElementById("enddate") as HTMLInputElement)
      .value;
    const endtime = (document.getElementById("endTime") as HTMLInputElement)
      .value;

    //funktionalitet för att kontrollera att tid / datum ligger i framtiden

    const d = endDate + " " + endtime;

    const date = new Date(d);

    const theNewAuction = {
      title: title,
      img: img,
      description: description,
      startPrice: startPrice,
      highestBid: null,
      creator: null, //ska tas från inlogg cookies
      highestBidder: null,
      endDateTime: date,
      status: "active",
      bids: [],
    } satisfies Auction;

    socket.emit("createAuction", theNewAuction);
  });

  socket.on("postauction", (auction: Auction[]) => {
    //logik för att visa skapade budgivningar , Auctio
  });

  //place bid
  //en input för amount
  //socket.emit( place bid, bid )

  //socket.on("displaybids", bid:bid[]) { create bidhtml }
});
