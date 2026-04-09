import type { Auction } from "./Models/Auction";
import type { AuctionForm } from "./Models/AuctionForm";
import type { Bid } from "./Models/Bid";
import "./style.css";
import { io } from "socket.io-client";
startApp(); //tillfällig lösning för att starta appen, kommer att flyttas in i en funktion som körs efter inloggning/registrering
// Register, inlogg och kolla om redan inloggad

document
  .getElementById("registerForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = (document.getElementById("registerName") as HTMLInputElement)
      .value;
    const email = (document.getElementById("registerEmail") as HTMLInputElement)
      .value;
    const password = (
      document.getElementById("registerPassword") as HTMLInputElement
    ).value;

    // Skicka data till servern
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    // Hantera svaret
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      startApp();
    }
  });

// Login
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = (document.getElementById("loginEmail") as HTMLInputElement)
    .value;
  const password = (
    document.getElementById("loginPassword") as HTMLInputElement
  ).value;

  // Skicka data till servern
  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  // Hantera svaret
  const data = await res.json();
  if (data.token) {
    localStorage.setItem("token", data.token);
    startApp();
  }
});

// Kolla om redan inloggad, om ja, starta appen direkt
const existingToken = localStorage.getItem("token");
if (existingToken) {
  startApp();
}

// Funktion som startar appen efter inloggning eller registrering
function startApp() {
  // Visa auktionssidan, dölj auth
  document.getElementById("authSection")!.style.display = "none";
  document.getElementById("auctionSection")!.style.display = "block";

  // När Sami lagt in allt klart:
  // Anslut med token i headern
  // const socket = io("http://localhost:3000", {
  //   auth: { token: localStorage.getItem("token") },
  // });
  // istället för nedan
  const socket = io("http://localhost:3000", {
    withCredentials: true,
  });

  //inlogg logik

  socket.on("connect", () => {
    console.log("socket:", socket.connected);

    socket.emit("getAuctions");

    socket.on("postAuction", (auctions: Auction[]) => {
      const container = document.getElementById("auctions")!;
      container.innerHTML = "";

      // Skapar HTML-element för varje auktion och lägg till dem i containern
      auctions.forEach((auction) => {
        createAuctionHTML(auction, container);
      });
    });

    // Skapa auktion - hämta värden från formuläret
    document.getElementById("auctionForm")?.addEventListener("submit", (e) => {
      e.preventDefault();

      const title = (document.getElementById("title") as HTMLInputElement)
        .value;
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

      const date = new Date(endDate + " " + endtime);

      const theNewAuction = {
        title,
        img,
        description,
        startPrice,
        endDateTime: date,
      } satisfies AuctionForm;

      socket.emit("createAuction", theNewAuction);
    });

    socket.on("chatHistory", (bids: Bid[]) => {
      console.log(bids);

      bids.forEach((bid) => {
        createChatHTML(bid);
      });
    });

    socket.on("NewBid", (bid: Bid) => {
      console.log(bid);
      createChatHTML(bid);
    });

    const createAuctionHTML = (auction: Auction, container: HTMLElement) => {
      const auctionDiv = document.createElement("div");
      auctionDiv.className = auction.id.toString();

      auctionDiv.id = auction.id.toString();
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
      joinauctionbtn.id = "joinauctionbtn";

      const msgInput = document.getElementById("msgInput");
      joinauctionbtn.addEventListener("click", () => {
        socket.emit("joinAuction", auction.id.toString());

        //document.getElementById(auction.id.toString())?.classList.add("hide");
        //göm alla element som man inte klickat på
        document.getElementById("auctionForm")?.classList.add("hide");
        const allAuctions = document.querySelectorAll("#auctions> div");
        allAuctions.forEach((element) => {
          if (element.id != auction.id.toString()) {
            element.classList.add("hide");
          }
          joinauctionbtn.classList.add("hide");

          msgInput?.classList.remove("hide");
          const sendMsgBtn = document.getElementById("sendmsg");
          sendMsgBtn?.classList.remove("hide");
        });
      });

      document.getElementById("msgform")?.addEventListener("submit", (e) => {
        e.preventDefault();

        const msgInputValue = (msgInput as HTMLInputElement).value;

        const newbid = {
          bidder: "",
          amount: parseInt(msgInputValue),
          time: new Date(),
        } satisfies Bid;

        // bids.push(newbid);

        socket.emit("place bid", auction.id, newbid);
      });
      auctionDiv.append(h2, price, creator, img, description, joinauctionbtn);
      container.append(auctionDiv);
    };
  });
}

const createChatHTML = (bid: Bid) => {
  const chatDiv = document.getElementById("chathistory");
  if (chatDiv) {
    const bidder = document.createElement("label");
    const amount = document.createElement("label");
    bidder.innerHTML = bid.bidder;
    amount.innerHTML = JSON.stringify(bid.amount);
    chatDiv.append(bidder, amount);
  }
};
