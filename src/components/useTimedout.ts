import { useState } from "react";
import { useTimeout } from "usehooks-ts";

export function useTimedout(delayMS: number) {
  const [visible, setVisible] = useState(true);

  const hide = () => {
    setVisible(false);
  };

  useTimeout(hide, delayMS);

  return visible;
}
