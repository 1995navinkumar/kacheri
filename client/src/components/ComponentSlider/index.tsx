import { useEffect, useState } from "react";
import { ComponentSliderProps } from "./types";

const CONTAINER_WIDTH = 400;

export default function ComponentSlider({
  children,
  direction,
}: ComponentSliderProps): JSX.Element {
  const initialTranslateAmount =
    direction === "left" ? CONTAINER_WIDTH : -CONTAINER_WIDTH;
  const [translateAmount, setTranslateAmount] = useState(
    initialTranslateAmount
  );
  useEffect(() => {
    setTranslateAmount(0);
  }, []);
  return (
    <div style={{ height: "100%", width: "100%", overflow: "hidden" }}>
      <div
        className="full-height full-width"
        style={{
          transition: "0.3s",
          transform: `translateX(${translateAmount}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
