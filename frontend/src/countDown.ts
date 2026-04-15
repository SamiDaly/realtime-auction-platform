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
      endTimeElement.innerHTML = "EXPIRED";
      joinBtn.disabled = true;
    }
  }, 1000);

  return () => clearInterval(interval);
}

export function formatEndDateTime(
  auction: Auction,
  callback: (time: { minutes: number; seconds: number }) => void,
) {
  const endDate = new Date(auction.endDateTime).getTime();

  const interval = setInterval(() => {
    const now = Date.now();
    const distance = endDate - now;

    const minutes = Math.floor(distance / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (distance <= 0) {
      clearInterval(interval);
      callback({ minutes: 0, seconds: 0 });
      return;
    }

    callback({ minutes, seconds });
  }, 1000);

  return interval; // så du kan stoppa den utifrån
}
