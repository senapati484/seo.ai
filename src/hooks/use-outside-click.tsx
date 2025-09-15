import React, { useEffect } from "react";

type OutsideEvent = MouseEvent | TouchEvent;

export const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement | null>,
  callback: (event: OutsideEvent) => void
) => {
  useEffect(() => {
    const listener = (event: OutsideEvent) => {
      // DO NOTHING if the element being clicked is the target element or their children
      const target = event.target as Node | null;
      if (!ref.current || (target && ref.current.contains(target))) {
        return;
      }
      callback(event);
    };

    document.addEventListener("mousedown", listener as EventListener);
    document.addEventListener("touchstart", listener as EventListener);

    return () => {
      document.removeEventListener("mousedown", listener as EventListener);
      document.removeEventListener("touchstart", listener as EventListener);
    };
  }, [ref, callback]);
};
