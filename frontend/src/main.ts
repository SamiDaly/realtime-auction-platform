import { createCountdown } from "./countDown";
import type { Auction } from "./Models/Auction";
import type { AuctionForm } from "./Models/AuctionForm";
import type { Bid } from "./Models/Bid";
import "./style.css";
import { io, type Socket } from "socket.io-client";

let currentAuctionId: number | null = null;

// Hero-navigation

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

document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.clear();
  document.body.style.backgroundColor = "";
  document.body.style.color = "";
  document.getElementById("auctionSection")!.style.display = "none";
  document.getElementById("authSection")!.style.display = "flex";
  document.getElementById("heroView")!.style.display = "flex";
  document.getElementById("loginView")!.style.display = "none";
  document.getElementById("registerView")!.style.display = "none";
});

document.getElementById("backFromRegister")?.addEventListener("click", () => {
  document.getElementById("registerView")!.style.display = "none";
  document.getElementById("heroView")!.style.display = "block";
});

document.getElementById("backToAuctions")?.addEventListener("click", () => {
  document.getElementById("auctionDetail")?.classList.add("hide");
  document.getElementById("auctionForm")?.classList.remove("hide");
  document.getElementById("auctions")?.classList.remove("hide");
});

// Register
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
  const email = (document.getElementById("loginEmail") as HTMLInputElement)
    .value;
  const password = (
    document.getElementById("loginPassword") as HTMLInputElement
  ).value;

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
  document.body.style.backgroundColor = "#ffffff";
  document.body.style.color = "#1a1a1a";

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

    const sorted = auctions.sort((a, b) => {
      const aActive = new Date(a.endDateTime).getTime() > Date.now();
      const bActive = new Date(b.endDateTime).getTime() > Date.now();
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;
      return 0;
    });

    sorted.forEach((auction) => {
      console.log("Auction:", auction);
      createAuctionHTML(auction, container, socket);
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
    if (typeof bid === "string") {
      alert(bid);
    } else {
      createChatHTML(bid);
    }
  });

  socket.on("displayWinner", (auction: Auction) => {
    console.log(" vinnande Auction:", auction);
    displayWinner(auction);
  });

  // Skapa auktion
  document.getElementById("auctionForm")?.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = (document.getElementById("title") as HTMLInputElement).value;
    const imgInput = document.getElementById("img") as HTMLInputElement;
    const file = imgInput.files?.[0];

    const description = (
      document.getElementById("description") as HTMLTextAreaElement
    ).value;
    const startPrice = parseInt(
      (document.getElementById("startPrice") as HTMLInputElement).value,
    );
    const endtime = (document.getElementById("endTime") as HTMLInputElement)
      .value;

    const MINUTE = 60000;
    const MinutesFromNow = new Date(Date.now() + parseInt(endtime) * MINUTE);

    if (!file) return;
    // När filen är färdigläst körs detta..
    const reader = new FileReader();

    reader.onload = () => {
      // Bilden konverteras till en sträng

      const img = reader.result as string;

      const theNewAuction = {
        title,
        img,
        description,
        startPrice,
        endDateTime: MinutesFromNow,
      } satisfies AuctionForm;

      socket.emit("createAuction", theNewAuction);
    };

    reader.readAsDataURL(file);
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
function createAuctionHTML(
  auction: Auction,
  container: HTMLElement,
  socket: Socket,
) {
  const auctionDiv = document.createElement("div");
  auctionDiv.id = auction.id.toString();

  const h2 = document.createElement("h2");
  const price = document.createElement("h3");
  const creator = document.createElement("h4");
  const img = document.createElement("img");
  const description = document.createElement("p");
  const endTime = document.createElement("p");

  h2.innerHTML = auction.title;
  price.innerHTML = auction.startPrice.toString() + "kr";
  creator.innerHTML = "Skapad av: " + auction.creator;
  img.src = auction.img;
  description.innerHTML = auction.description;

  const joinBtn = document.createElement("button");
  joinBtn.innerHTML = "Buda på auktionen";


 // Kolla om auktionen är avslutad
  const endDate = new Date(auction.endDateTime);
  const minutesLeft = Math.floor((endDate.getTime() - Date.now()) / 60000);
  createCountdown(auction, endTime, joinBtn);

  if (minutesLeft <= 0) {
  auctionDiv.classList.add("ended");
  }

  joinBtn.addEventListener("click", () => {
    currentAuctionId = auction.id;
    socket.emit("joinAuction", currentAuctionId.toString());

    // Dölj auktionslistan och formuläret
    document.getElementById("auctionForm")?.classList.add("hide");
    document.getElementById("auctions")?.classList.add("hide");

    const sendmsgBtn = document.getElementById("sendmsg") as HTMLButtonElement;
    document.getElementById("msgInput")?.classList.remove("hide");
    sendmsgBtn?.classList.remove("hide");

    // Fyll i detaljer
    document.getElementById("detailTitle")!.innerHTML = auction.title;
    (document.getElementById("detailImg") as HTMLImageElement).src =
      auction.img;
    document.getElementById("detailPrice")!.innerHTML =
      auction.startPrice + " kr";
    document.getElementById("detailDescription")!.innerHTML =
      auction.description;
    document.getElementById("detailCreator")!.innerHTML =
      "Skapad av: " + auction.creator;
    const timedetails = document.getElementById("detailTime");
    if (timedetails && sendmsgBtn)
      createCountdown(auction, timedetails, sendmsgBtn);

    // Visa detaljvyn
    document.getElementById("auctionDetail")?.classList.remove("hide");
  });

  auctionDiv.append(h2, img, price, description, creator, endTime, joinBtn);
  container.append(auctionDiv);
}

// Visa ett bud i chatten
function createChatHTML(bid: Bid) {
  const chatDiv = document.getElementById("chathistory");
  if (chatDiv) {
    const bidder = document.createElement("label");
    const amount = document.createElement("label");
    bidder.innerHTML = "Budgivare: " + bid.bidder;
    amount.innerHTML =
      JSON.stringify(bid.amount) +
      " kr" +
      " - " +
      new Date(bid.time).toLocaleTimeString();
    chatDiv.append(bidder, amount);
  }
}

function displayWinner(auction: Auction) {
  const winnerDiv = document.getElementById("winner");
  if (winnerDiv) {
    winnerDiv.innerHTML = "";
    const h3 = document.createElement("h3");
    const h4 = document.createElement("h4");

    h3.innerHTML = "vinnare :" + auction.highestBidder;
    h4.innerHTML = "vinnande bud :" + auction.highestBid;
    winnerDiv.append(h3, h4);
  }
}
