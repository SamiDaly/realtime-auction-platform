import type { Auction } from "./Models/Auction";
import type { Bid } from "./Models/Bid";

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

    endTimeElement.innerHTML = `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;

    if (distance < 0) {
      clearInterval(interval);
      endTimeElement.innerHTML = "EXPIRED";
      joinBtn.disabled = true;
    }
  }, 1000);

  return () => clearInterval(interval);
}

export function gettimeLeft(auction: Auction) {
  const endDate = new Date(auction.endDateTime).getTime();
  const now = Date.now();

  const distance = endDate - now;

  return Math.max(0, Math.floor(distance / 1000));
}
