import type { Auction } from "./Models/Auction";
import type { AuctionForm } from "./Models/AuctionForm";
//import type { AuctionForm } from "./Models/AuctionForm";
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
      endDateTime: date,
      status: "active",
    } satisfies AuctionForm;

    socket.emit("createAuction", theNewAuction);

    socket.on("postAuction", (auctions: Auction[]) => {
      // console.log(localStorage.getItem("auctions"));
      //töm auctions id
      //  console.log(auctions);

      auctions.forEach((auction) => {
        const h2 = document.createElement("h2");
        const price = document.createElement("h3");
        const creator = document.createElement("h4");
        const img = document.createElement("img");
        const description = document.createElement("p");
        h2.innerHTML = auction.title;
        price.innerHTML = auction.startPrice.toString() + "kr";
        creator.innerHTML = auction.creator;
        img.src = auction.img;
        description.innerHTML = auction.description;
        const joinauctionbtn = document.createElement("button");
        joinauctionbtn.innerHTML = "join auction";

        joinauctionbtn.addEventListener("click", () => {
          socket.emit("joinAuction", auction.id);
        });

        document
          .getElementById("auctions")
          ?.append(h2, price, creator, img, description, joinauctionbtn);
      });
    });

    //    socket.on("chatHistory", )
  });

  //place bid
  //en input för amount
  //socket.emit( place bid, bid )

  //socket.on("displaybids", bid:bid[]) { create bidhtml }
});
