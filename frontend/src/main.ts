import type { Auction } from "./Models/Auction";
import type { AuctionForm } from "./Models/AuctionForm";
import "./style.css";
import { io } from "socket.io-client";

// Hero-navigation — lägg till högst upp i main.ts
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

// Register, inlogg och kolla om redan inloggad
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = (document.getElementById("registerName") as HTMLInputElement).value;
  const email = (document.getElementById("registerEmail") as HTMLInputElement).value;
  const password = (document.getElementById("registerPassword") as HTMLInputElement).value;

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
  const email = (document.getElementById("loginEmail") as HTMLInputElement).value;
  const password = (document.getElementById("loginPassword") as HTMLInputElement).value;

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

  const socket = io("http://localhost:3000", {
     auth: { token: localStorage.getItem("token") },
  });  

//inlogg logik

socket.on("connect", () => {
  console.log("socket:", socket.connected);
});

 // Skapar en lyssnare som lyssnar på "postAuction" eventet och uppdaterar
 // DOM:en med de nya auktionerna som skickas från servern
    socket.on("postAuction", (auctions: Auction[]) => {  
      const container = document.getElementById("auctions")!;
      container.innerHTML = "";

      // Skapar HTML-element för varje auktion och lägg till dem i containern
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

        container.append(h2, price, creator, img, description);
      });
    });

    // Skapa auktion - hämta värden från formuläret
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

      socket.emit("createAuction", theNewAuction);
    });
}

  //place bid
  //en input för amount
  //socket.emit( place bid, bid )

  //socket.on("displaybids", bid:bid[]) { create bidhtml }
  // });
