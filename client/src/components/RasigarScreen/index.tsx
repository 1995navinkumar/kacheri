import { useState } from "react";

export default function RasigarScreen({ audioControls }): JSX.Element {
  const [isPlaying, setIsPlaying] = useState(true);

  const onToggleClick = () => {
    audioControls.togglePlay();
    setIsPlaying(audioControls.isPlaying());
  };

  return (
    <div className="flex-column" style={{ gap: "48px" }}>
      <p className="create-description">Rasigar Screen</p>
      <div className="flex-row align-center justify-center">
        <button className="cta-btn play-btn" onClick={onToggleClick}>
          <img src={isPlaying ? "assets/pause.svg" : "assets/play.svg"} />
        </button>
      </div>
    </div>
  );
}
