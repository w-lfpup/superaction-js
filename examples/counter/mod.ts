import { SuperAction, SuperActionEvent } from "superaction";

const _superAction = new SuperAction({
  host: document,
  connected: true,
  eventNames: ["click"],
});

const countEl = document.querySelector("[count]")!;
let count = parseFloat(countEl.textContent ?? "");

addEventListener("#action", function (e: Event) {
  if (!(e instanceof SuperActionEvent)) return;

  let { action } = e;

  if ("increment" === action) {
    count += 1;
  }

  if ("decrement" === action) {
    count -= 1;
  }

  countEl.textContent = count.toString();
});
