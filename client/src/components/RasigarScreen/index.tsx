import { useEffect, useState } from "react";
import { useGlobalState } from "../../Providers/GlobalStateProvider";

export default function RasigarScreen({ audioControls }): JSX.Element {
  const [isPlaying, setIsPlaying] = useState(true);
  const { state } = useGlobalState();
  const { kacheriId } = state.app;

  const onToggleClick = () => {
    audioControls.togglePlay();
    setIsPlaying(audioControls.isPlaying());
  };

  function drawWaveform({
    ctx,
    canvas,
    backgroundColor,
    waveformColor,
    audio,
  }) {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // const audioSrc = audioContext.createMediaElementSource(
    //   audioControls.audioSrc
    // );

    const audioSrc = audioContext.createMediaStreamSource(window.rtcStream);

    audioSrc.connect(analyser);
    // analyser.connect(audioContext.destination);

    const draw = function () {
      const drawVisual = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 4;
      ctx.strokeStyle = waveformColor;
      ctx.beginPath();

      const sliceWidth = (Math.PI * 2) / bufferLength;
      let x = canvas.width / 2;
      let y = canvas.height / 2;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const radius = (v * canvas.height) / 2;

        const startX = x + Math.cos(i * sliceWidth) * radius;
        const startY = y + Math.sin(i * sliceWidth) * radius;

        if (i === 0) {
          ctx.moveTo(startX, startY);
        } else {
          ctx.lineTo(startX, startY);
        }
      }

      ctx.closePath();
      ctx.stroke();
    };

    draw();
  }

  useEffect(() => {
    const canvas = document.getElementById("waveform") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    const backgroundColor = "rgba(0, 0, 0, 0.5)";
    const waveformColor = "#B8860B";
    drawWaveform({
      ctx,
      backgroundColor,
      waveformColor,
      audio: audioControls.audioSrc,
      canvas,
    });
  }, []);

  return (
    <div className="flex-column align-center" style={{ gap: "48px" }}>
      <div className="create-description">
        Listening to Kacheri - {kacheriId}
      </div>
      <div id="waveform-container" style={{ width: "200px", height: "200px" }}>
        <canvas
          id="waveform"
          className="full-height full-width"
          width="200"
          height="200"
        ></canvas>
      </div>
      <div className="flex-row align-center justify-center">
        <button className="cta-btn play-btn" onClick={onToggleClick}>
          <img src={isPlaying ? "assets/pause.svg" : "assets/play.svg"} />
        </button>
      </div>
    </div>
  );
}
