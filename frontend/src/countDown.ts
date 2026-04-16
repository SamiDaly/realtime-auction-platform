import type { Auction } from "./Models/Auction";

export function createCountdown(
  auction: Auction,
  endTimeElement: HTMLElement,
  joinBtn: HTMLButtonElement,
) {
  let endDate = new Date(auction.endDateTime).getTime();

  let interval = setInterval(() => {
    let now = Date.now();
    let distance = endDate - now;

    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    endTimeElement.innerHTML =
      "Tid kvar: " + `${minutes}:${seconds.toString().padStart(2, "0")}`;

    if (distance < 0) {
      clearInterval(interval);
      if (auction.highestBidder) {
        const winnerName = auction.highestBidder.charAt(0).toUpperCase() + auction.highestBidder.slice(1);
        endTimeElement.innerHTML = "Vinnare: " + winnerName;
      } else {
        endTimeElement.innerHTML = "Ingen vinnare";
      }
      joinBtn.innerHTML = "Utgången auktion";
      joinBtn.disabled = true;
      joinBtn.classList.add("expired-btn");
    }
  }, 1000);

  return () => clearInterval(interval);
}
