import type { Auction } from "./Models/Auction";
import type { AuctionForm } from "./Models/AuctionForm";
import type { Bid } from "./Models/Bid";
import "./style.css";
import { io, Socket } from "socket.io-client";

// Hero-navigation
let currentAuctionId: number | null = null;
document.getElementById("showLogin")?.addEventListener("click", () => {
  document.getElementById("heroView")!.style.display = "none";
  document.getElementById("loginView")!.style.display = "flex";
});

document.getElementById("showRegister")?.addEventListener("click", () => {
  document.getElementById("heroView")!.style.display = "none";
  document.getElementById("registerView")!.style.display = "flex";
});

document.getElementById("backFromLogin")?.addEventListener("click", () => {
  document.getElementById("loginView")!.style.display = "none";
  document.getElementById("heroView")!.style.display = "block";
});

document.getElementById("backFromRegister")?.addEventListener("click", () => {
  document.getElementById("registerView")!.style.display = "none";
  document.getElementById("heroView")!.style.display = "block";
});

// Register
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = (document.getElementById("registerName") as HTMLInputElement).value;
  const email = (document.getElementById("registerEmail") as HTMLInputElement).value;
  const password = (document.getElementById("registerPassword") as HTMLInputElement).value;

  const res = await fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();
  if (data.token) {
    localStorage.setItem("token", data.token);
    startApp();
  }
});

// Login
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = (document.getElementById("loginEmail") as HTMLInputElement).value;
  const password = (document.getElementById("loginPassword") as HTMLInputElement).value;

  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (data.token) {
    localStorage.setItem("token", data.token);
    startApp();
  }
});

// Kolla om redan inloggad
const existingToken = localStorage.getItem("token");
if (existingToken) {
  startApp();
}

function startApp() {
  document.getElementById("authSection")!.style.display = "none";
  document.getElementById("auctionSection")!.style.display = "block";

  const socket = io("http://localhost:3000", {
    auth: { token: localStorage.getItem("token") },
  });

  socket.on("connect", () => {
    console.log("socket:", socket.connected);
    socket.emit("getAuctions");
  });

  // Visa auktioner
  socket.on("postAuction", (auctions: Auction[]) => {
    const container = document.getElementById("auctions")!;
    container.innerHTML = "";

    auctions.forEach((auction) => {
      createAuctionHTML(auction, container);
    });
  });

  // Budhistorik
  socket.on("chatHistory", (bids: Bid[]) => {
    bids.forEach((bid) => {
      createChatHTML(bid);
    });
  });

  // Nytt bud i realtid
  socket.on("NewBid", (bid: Bid) => {
    if (typeof bid == "string") {
      alert(bid);
    } else {
      createChatHTML(bid);
    }
  });

  // Skapa auktion
  document.getElementById("auctionForm")?.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = (document.getElementById("title") as HTMLInputElement).value;
    const img = (document.getElementById("img") as HTMLInputElement).value;
    const description = (document.getElementById("description") as HTMLTextAreaElement).value;
    const startPrice = parseInt((document.getElementById("startPrice") as HTMLInputElement).value);
    const endDate = (document.getElementById("enddate") as HTMLInputElement).value;
    const endtime = (document.getElementById("endTime") as HTMLInputElement).value;

    const date = new Date(endDate + " " + endtime);

    const theNewAuction = {
      title,
      img,
      description,
      startPrice,
      endDateTime: date,
    } satisfies AuctionForm;
    console.log(theNewAuction);

    socket.emit("createAuction", theNewAuction);
  });

  // Lägg bud
  document.getElementById("msgform")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const msgInput = document.getElementById("msgInput") as HTMLInputElement;

    const newBid = {
      bidder: "",
      amount: parseInt(msgInput.value),
      time: new Date(),
    } satisfies Bid;

    socket.emit("place bid", currentAuctionId, newBid);
  });
}

// Skapa HTML för en auktion
function createAuctionHTML(auction: Auction, container: HTMLElement, socket: Socket) {
  const auctionDiv = document.createElement("div");
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

  const joinBtn = document.createElement("button");
  joinBtn.innerHTML = "Join auction";

  joinBtn.addEventListener("click", () => {
    currentAuctionId = auction.id;
    socket.emit("joinAuction", currentAuctionId.toString());

    // Visa bara den valda auktionen och dölja resten
    document.getElementById("auctionForm")?.classList.add("hide");
    const allAuctions = document.querySelectorAll("#auctions > div");
    allAuctions.forEach((element) => {
      if (element.id !== auction.id.toString()) {
        element.classList.add("hide");
      }
    });
    joinBtn.classList.add("hide");

    // Visa budformuläret
    document.getElementById("msgInput")?.classList.remove("hide");
    document.getElementById("sendmsg")?.classList.remove("hide");
  });

  // Lägg till auktionen i DOM:en
  auctionDiv.append(h2, price, creator, img, description, joinBtn);
  container.append(auctionDiv);
}

// Visa ett bud i chatten
function createChatHTML(bid: Bid) {
  const chatDiv = document.getElementById("chathistory");
  if (chatDiv) {
    const bidder = document.createElement("label");
    const amount = document.createElement("label");
    bidder.innerHTML = bid.bidder;
    amount.innerHTML = JSON.stringify(bid.amount);
    chatDiv.append(bidder, amount);
  }
}
