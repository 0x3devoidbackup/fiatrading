"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  HandLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

const HandScanner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [handLandmarker, setHandLandmarker] = useState<HandLandmarker | null>(null);
  const [handDetected, setHandDetected] = useState(false);
  const [fingerCount, setFingerCount] = useState<number | null>(null);

  useEffect(() => {
    let animationFrameId: number;

    const init = async () => {
      try {
        setIsLoading(true);

        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
        );

        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          },
          runningMode: "VIDEO",
          numHands: 1,
        });

        setHandLandmarker(landmarker);
        setIsLoading(false);

        // Access camera
        if (videoRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        const detect = async () => {
          if (!videoRef.current || !canvasRef.current || !landmarker) {
            animationFrameId = requestAnimationFrame(detect);
            return;
          }

          const ctx = canvasRef.current.getContext("2d");
          if (!ctx) {
            animationFrameId = requestAnimationFrame(detect);
            return;
          }

          // Detect hands
          const results = await landmarker.detectForVideo(
            videoRef.current,
            performance.now()
          );

          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(
            videoRef.current,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );

          if (results.landmarks && results.landmarks.length > 0) {
            const drawingUtils = new DrawingUtils(ctx);
            for (const landmarks of results.landmarks) {
              drawingUtils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS);
              drawingUtils.drawLandmarks(landmarks);
            }

            setHandDetected(true);

            // Simple finger counting logic (based on y-coordinate)
            const landmarks = results.landmarks[0];
            const wristY = landmarks[0].y;
            let count = 0;
            // Finger tips index: [8, 12, 16, 20] + thumb 4
            const tips = [4, 8, 12, 16, 20];
            tips.forEach((tipIndex) => {
              if (landmarks[tipIndex].y < wristY - 0.05) count++;
            });
            setFingerCount(count);
          } else {
            setHandDetected(false);
            setFingerCount(null);
          }

          animationFrameId = requestAnimationFrame(detect);
        };

        detect();
      } catch (error) {
        console.error("Error initializing hand detection:", error);
      }
    };

    init();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Hand Scanner</h2>

      {isLoading && <p>Loading hand detector model...</p>}

      <div className="relative w-[640px] h-[480px]">
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full rounded-xl"
          playsInline
          muted
        ></video>
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="absolute top-0 left-0 w-full h-full rounded-xl"
        ></canvas>
      </div>

      <div className="mt-4 text-center">
        {handDetected ? (
          <p className="text-green-600 font-semibold">
            ✅ Hand detected — Fingers raised: {fingerCount}
          </p>
        ) : (
          <p className="text-gray-500">No hand detected</p>
        )}
      </div>
    </div>
  );
};

export default HandScanner;
