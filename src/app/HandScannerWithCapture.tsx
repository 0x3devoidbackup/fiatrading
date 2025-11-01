"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  HandLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

type Landmark = { x: number; y: number; z?: number };
type ScannedHand = {
  id: string;
  imageDataUrl: string;
  landmarks: Landmark[]; // flattened single hand landmarks
  timestamp: string;
};

const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";
const WASM_BASE =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm";

export default function HandScannerWithCapture() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [handLandmarker, setHandLandmarker] = useState<HandLandmarker | null>(null);
  const [handDetected, setHandDetected] = useState(false);
  const [fingerCount, setFingerCount] = useState<number | null>(null);
  const [scannedHands, setScannedHands] = useState<ScannedHand[]>([]);
  const [selectedHandId, setSelectedHandId] = useState<string | null>(null);

  // Prevent repeated captures while the same continuous detection persists
  // We capture once per detection session; when hand leaves (handDetected=false) we allow next capture.
  const hasCapturedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  // Initialize MediaPipe HandLandmarker and camera
  useEffect(() => {
    let isCancelled = false;

    const init = async () => {
      try {
        setIsLoading(true);

        const vision = await FilesetResolver.forVisionTasks(WASM_BASE);

        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: MODEL_URL,
          },
          runningMode: "VIDEO",
          numHands: 1,
        });

        if (isCancelled) {
          landmarker.close();
          return;
        }

        setHandLandmarker(landmarker);
        setIsLoading(false);

        // Setup camera
        if (videoRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: false,
          });
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        // adjust canvas size to video once playing
        const resizeCanvas = () => {
          if (!videoRef.current || !canvasRef.current) return;
          const v = videoRef.current;
          const c = canvasRef.current;
          c.width = v.videoWidth || 640;
          c.height = v.videoHeight || 480;
        };

        if (videoRef.current) {
          videoRef.current.addEventListener("loadedmetadata", resizeCanvas);
        }

        // detection loop
        const detect = async () => {
          if (!videoRef.current || !canvasRef.current || !landmarker) {
            rafRef.current = requestAnimationFrame(detect);
            return;
          }

          const ctx = canvasRef.current.getContext("2d");
          if (!ctx) {
            rafRef.current = requestAnimationFrame(detect);
            return;
          }

          // run detection
          const results = await landmarker.detectForVideo(
            videoRef.current,
            performance.now()
          );

          // draw video frame
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(
            videoRef.current,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );

          if (results.landmarks && results.landmarks.length > 0) {
            setHandDetected(true);

            // draw landmarks & connectors
            const drawingUtils = new DrawingUtils(ctx);
            for (const landmarks of results.landmarks) {
              // convert from normalized {x,y} to pixel coords for drawing utils
              drawingUtils.drawConnectors(landmarks, (HandLandmarker as any).HAND_CONNECTIONS);
              drawingUtils.drawLandmarks(landmarks);
            }

            // finger counting (rudimentary)
            const landmarks = results.landmarks[0];
            const wristY = landmarks[0].y;
            let count = 0;
            const tips = [4, 8, 12, 16, 20];
            tips.forEach((tipIndex) => {
              if (landmarks[tipIndex].y < wristY - 0.05) count++;
            });
            setFingerCount(count);

            // Auto-capture once per detection session
            if (!hasCapturedRef.current) {
              try {
                // Capture snapshot from the canvas (which already has video + drawing)
                const dataUrl = canvasRef.current.toDataURL("image/png");

                // Convert landmarks to a simplified numeric format (normalized coordinates)
                const simplified: Landmark[] = landmarks.map((lm: any) => ({
                  x: Number(lm.x),
                  y: Number(lm.y),
                  z: lm.z !== undefined ? Number(lm.z) : undefined,
                }));

                const newScan: ScannedHand = {
                  id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                  imageDataUrl: dataUrl,
                  landmarks: simplified,
                  timestamp: new Date().toISOString(),
                };

                setScannedHands((prev) => [newScan, ...prev]);
                setSelectedHandId(newScan.id);

                // mark captured until hand leaves the frame
                hasCapturedRef.current = true;
              } catch (err) {
                console.error("Capture error:", err);
              }
            }
          } else {
            // no hand
            setHandDetected(false);
            setFingerCount(null);
            // allow next capture session when hand leaves
            hasCapturedRef.current = false;
          }

          rafRef.current = requestAnimationFrame(detect);
        };

        detect();
      } catch (err) {
        console.error("Initialization error:", err);
        setIsLoading(false);
      }
    };

    init();

    return () => {
      isCancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (videoRef.current && videoRef.current.srcObject instanceof MediaStream) {
        // stop all tracks
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((t) => t.stop());
      }
      if (handLandmarker) {
        try {
          handLandmarker.close();
        } catch (e) {
          // ignore
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Utility: download a file
  const downloadFile = (filename: string, dataUrlOrStr: string, asDataUrl = false) => {
    const a = document.createElement("a");
    if (asDataUrl) {
      a.href = dataUrlOrStr;
    } else {
      const blob = new Blob([dataUrlOrStr], { type: "application/json" });
      a.href = URL.createObjectURL(blob);
    }
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleDownloadImage = (scan: ScannedHand) => {
    // data URL already
    downloadFile(`hand-${scan.id}.png`, scan.imageDataUrl, true);
  };

  const handleDownloadJSON = (scan: ScannedHand) => {
    const json = {
      id: scan.id,
      timestamp: scan.timestamp,
      landmarks: scan.landmarks,
    };
    downloadFile(`hand-${scan.id}.json`, JSON.stringify(json, null, 2), false);
  };

  const handleDeleteScan = (id: string) => {
    setScannedHands((prev) => prev.filter((s) => s.id !== id));
    setSelectedHandId((cur) => (cur === id ? null : cur));
  };

  const selectedScan = scannedHands.find((s) => s.id === selectedHandId) ?? null;

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <h2 className="text-xl font-semibold">Hand Scanner — Auto-capture</h2>

      <div className="relative w-[640px] h-[480px] rounded overflow-hidden border">
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />
      </div>

      <div className="w-[640px] flex items-center justify-between">
        <div>
          {isLoading ? (
            <span>Loading model...</span>
          ) : handDetected ? (
            <span className="text-green-600 font-medium">
              ✅ Hand detected — Fingers: {fingerCount ?? "--"}
            </span>
          ) : (
            <span className="text-gray-500">No hand detected</span>
          )}
        </div>

        <div className="flex gap-2 items-center">
          <button
            type="button"
            className="px-3 py-1 rounded bg-blue-600 text-white"
            onClick={() => {
              // Manual capture (only allowed if there's a hand and haven't captured in this session)
              if (!canvasRef.current) return;
              if (!handDetected) {
                alert("No hand detected to capture.");
                return;
              }
              if (hasCapturedRef.current) {
                alert("Already captured for this continuous detection. Remove hand from frame to capture again.");
                return;
              }
              // Trigger capture by simulating behavior used in loop:
              try {
                const dataUrl = canvasRef.current.toDataURL("image/png");
                // We don't have the exact landmarks here unless we saved them; but loop saves them automatically.
                // However for manual capture we'll just capture image; landmarks will be captured by loop shortly.
                const tempScan: ScannedHand = {
                  id: `${Date.now()}-manual`,
                  imageDataUrl: dataUrl,
                  landmarks: [],
                  timestamp: new Date().toISOString(),
                };
                setScannedHands((prev) => [tempScan, ...prev]);
                setSelectedHandId(tempScan.id);
                hasCapturedRef.current = true;
              } catch (err) {
                console.error("Manual capture error:", err);
              }
            }}
          >
            Manual capture
          </button>

          <button
            type="button"
            className="px-3 py-1 rounded bg-gray-700 text-white"
            onClick={() => {
              // clear all
              if (!confirm("Clear all scanned hands?")) return;
              setScannedHands([]);
              setSelectedHandId(null);
            }}
          >
            Clear list
          </button>
        </div>
      </div>

      <div className="w-[640px] grid grid-cols-4 gap-3">
        {scannedHands.length === 0 ? (
          <div className="col-span-4 text-center text-gray-500">No scanned hands yet — wave your hand to capture.</div>
        ) : (
          scannedHands.map((s) => (
            <div
              key={s.id}
              className={`border rounded overflow-hidden cursor-pointer ${
                selectedHandId === s.id ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => setSelectedHandId(s.id)}
            >
              <img src={s.imageDataUrl} alt={`scan-${s.id}`} className="w-full h-28 object-cover" />
              <div className="p-2 text-xs">
                <div className="truncate">{new Date(s.timestamp).toLocaleString()}</div>
                <div className="flex gap-1 mt-1">
                  <button
                    className="text-xs px-2 py-0.5 bg-green-600 text-white rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadImage(s);
                    }}
                  >
                    Image
                  </button>
                  <button
                    className="text-xs px-2 py-0.5 bg-indigo-600 text-white rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadJSON(s);
                    }}
                  >
                    JSON
                  </button>
                  <button
                    className="text-xs px-2 py-0.5 bg-red-600 text-white rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteScan(s.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Details pane */}
      <div className="w-[640px] border rounded p-3">
        {selectedScan ? (
          <div className="flex gap-4">
            <div className="w-48 h-48 border overflow-hidden">
              <img src={selectedScan.imageDataUrl} alt="selected" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">Scanned hand — {new Date(selectedScan.timestamp).toLocaleString()}</h3>
                <div className="flex gap-2">
                  <button
                    className="px-2 py-1 bg-green-600 text-white rounded text-sm"
                    onClick={() => handleDownloadImage(selectedScan)}
                  >
                    Download Image
                  </button>
                  <button
                    className="px-2 py-1 bg-indigo-600 text-white rounded text-sm"
                    onClick={() => handleDownloadJSON(selectedScan)}
                  >
                    Download JSON
                  </button>
                </div>
              </div>

              <div className="mt-3 text-sm">
                <div className="font-semibold mb-1">Landmarks (x, y, z) — {selectedScan.landmarks.length} points</div>
                {selectedScan.landmarks.length === 0 ? (
                  <div className="text-xs text-gray-500">No landmark data saved for this capture.</div>
                ) : (
                  <pre className="text-xs max-h-48 overflow-auto bg-gray-900 p-2 rounded text-white">
                    {JSON.stringify(selectedScan.landmarks, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">Select a scanned hand to view details.</div>
        )}
      </div>
    </div>
  );
}
