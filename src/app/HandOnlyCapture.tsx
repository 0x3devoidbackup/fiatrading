"use client";

import React, { useEffect, useRef, useState } from "react";

export default function HandOnlyCapture() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const overlayRef = useRef<HTMLCanvasElement | null>(null);
  const outputRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let hands: any;
    let camera: any;
    let mounted = true;

    async function init() {
      if (typeof window === "undefined") return;

      const video = videoRef.current!;
      const overlay = overlayRef.current!;
      const out = outputRef.current!;
      video.width = 640;
      video.height = 480;
      overlay.width = 640;
      overlay.height = 480;

      // ✅ Dynamically import browser-only scripts
      const { Hands } = await import("@mediapipe/hands");
      const { Camera } = await import("@mediapipe/camera_utils");
    //   const { drawConnectors, drawLandmarks } = await import("@mediapipe/drawing_utils");

      hands = new Hands({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6,
      });

      hands.onResults((results: any) => {
        if (!mounted) return;
        const ctx = overlay.getContext("2d")!;
        ctx.clearRect(0, 0, overlay.width, overlay.height);

        if (!results.multiHandLandmarks?.length) {
          const outCtx = out.getContext("2d")!;
          outCtx.clearRect(0, 0, out.width, out.height);
          return;
        }

        const landmarks = results.multiHandLandmarks[0];
        let minX = 1, minY = 1, maxX = 0, maxY = 0;
        for (const lm of landmarks) {
          minX = Math.min(minX, lm.x);
          minY = Math.min(minY, lm.y);
          maxX = Math.max(maxX, lm.x);
          maxY = Math.max(maxY, lm.y);
        }

        const pad = 0.15;
        const widthNorm = maxX - minX;
        const heightNorm = maxY - minY;
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;
        const maxDim = Math.max(widthNorm, heightNorm) * (1 + pad);

        const videoW = video.videoWidth;
        const videoH = video.videoHeight;
        const boxPxW = Math.min(videoW, Math.round(maxDim * videoW));
        const boxPxH = Math.min(videoH, Math.round(maxDim * videoH));
        const boxCxPx = Math.round(cx * videoW);
        const boxCyPx = Math.round(cy * videoH);

        let sx = boxCxPx - Math.round(boxPxW / 2);
        let sy = boxCyPx - Math.round(boxPxH / 2);
        sx = Math.max(0, Math.min(sx, videoW - boxPxW));
        sy = Math.max(0, Math.min(sy, videoH - boxPxH));

        ctx.strokeStyle = "lime";
        ctx.lineWidth = 2;
        ctx.strokeRect(sx, sy, boxPxW, boxPxH);

        const outCtx = out.getContext("2d")!;
        out.width = boxPxW;
        out.height = boxPxH;
        outCtx.clearRect(0, 0, out.width, out.height);
        outCtx.drawImage(video, sx, sy, boxPxW, boxPxH, 0, 0, out.width, out.height);
      });

      camera = new Camera(video, {
        onFrame: async () => {
          await hands.send({ image: video });
        },
        width: 640,
        height: 480,
      });

      camera.start();
      setRunning(true);
    }

    init();

    return () => {
      mounted = false;
      try {
        camera?.stop();
      } catch {}
      setRunning(false);
    };
  }, []);

  const handleCapture = () => {
    const out = outputRef.current;
    if (!out) return;
    const url = out.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `hand_capture_${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Hand-only Capture</h2>

      <div className="flex gap-4">
        <div style={{ position: "relative" }}>
          <video
            ref={videoRef}
            style={{
              transform: "scaleX(-1)",
              display: "block",
              width: 320,
              height: 240,
            }}
            autoPlay
            playsInline
            muted
          />
          <canvas
            ref={overlayRef}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 320,
              height: 240,
              pointerEvents: "none",
            }}
          />
        </div>

        <div>
          <div
            style={{
              border: "1px solid #ccc",
              width: 320,
              height: 240,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <canvas
              ref={outputRef}
              style={{ maxWidth: "320px", maxHeight: "240px" }}
            />
          </div>
          <button
            onClick={handleCapture}
            className="mt-2 px-3 py-1 rounded bg-blue-600 text-white"
          >
            Capture Hand (PNG)
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Only the hand region is captured — no face or body.
      </p>

      <div className="mt-2 text-sm">
        Status: {running ? "Running" : "Loading..."}
      </div>
    </div>
  );
}
