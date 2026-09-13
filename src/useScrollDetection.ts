import { useState, useEffect } from "react";

export function useScrollDetection() {
  const [hasScrolledDown, setHasScrolledDown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // If the scroll position is greater than 0, they have scrolled down
      if (window.scrollY > 0) {
        setHasScrolledDown(true);
      } else {
        setHasScrolledDown(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up event listener on component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return hasScrolledDown;
}
