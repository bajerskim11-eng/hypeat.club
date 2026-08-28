import { flushSync } from "react-dom";

export function withViewTransition(update: () => void) {
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => { finished: Promise<void> };
  };
  if (typeof doc.startViewTransition !== "function") {
    update();
    return;
  }
  doc.startViewTransition(() => {
    flushSync(update);
  });
}
