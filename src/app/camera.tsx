"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Camera, Hand, CheckCircle, AlertCircle } from 'lucide-react';

interface HandLandmark {
    x: number;
    y: number;
    z: number;
}

interface HandData {
    landmarks: HandLandmark[];
    timestamp: number;
    fingersExtended: number;
}

interface MediaPipeHands {
    setOptions: (options: HandsOptions) => void;
    onResults: (callback: (results: HandsResults) => void) => void;
    send: (inputs: { image: HTMLVideoElement }) => Promise<void>;
}

interface HandsOptions {
    maxNumHands: number;
    modelComplexity: number;
    minDetectionConfidence: number;
    minTrackingConfidence: number;
}

interface HandsResults {
    multiHandLandmarks?: HandLandmark[][];
    multiHandedness?: Array<{
        score: number;
        index: number;
        label: string;
    }>;
}

interface MediaPipeWindow extends Window {
    Hands?: new (config: { locateFile: (file: string) => string }) => MediaPipeHands;
}

declare const window: MediaPipeWindow;

export default function HandScannerApp() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [handDetected, setHandDetected] = useState(false);
    const [fingersCount, setFingersCount] = useState(0);
    const [scanComplete, setScanComplete] = useState(false);
    const [capturedData, setCapturedData] = useState<HandData | null>(null);
    const [error, setError] = useState<string>('');
    const handsRef = useRef<MediaPipeHands | null>(null);
    const animationFrameRef = useRef<number>();



    const loadMediaPipe = async () => {
        try {
            // Load MediaPipe Hands
            const script1 = document.createElement('script');
            script1.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';
            script1.crossOrigin = 'anonymous';
            document.head.appendChild(script1);

            const script2 = document.createElement('script');
            script2.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';
            script2.crossOrigin = 'anonymous';
            document.head.appendChild(script2);

            const script3 = document.createElement('script');
            script3.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js';
            script3.crossOrigin = 'anonymous';
            document.head.appendChild(script3);
        } catch (err) {
            setError('Failed to load hand detection library');
        }
    };

    const startCamera = async () => {
        setIsLoading(true);
        setError('');
        setScanComplete(false);
        setCapturedData(null);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720, facingMode: 'user' }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play();
                    setCameraActive(true);
                    setIsLoading(false);
                    initializeHandDetection();
                };
            }
        } catch (err) {
            setError('Camera access denied. Please allow camera permissions.');
            setIsLoading(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setCameraActive(false);
        setHandDetected(false);
        setFingersCount(0);
    };

    const initializeHandDetection = async () => {
        // Wait for MediaPipe to load
        const checkMediaPipe = setInterval(() => {
            if (window.Hands) {
                clearInterval(checkMediaPipe);
                setupHandDetection();
            }
        }, 100);
    };


    useEffect(() => {
        loadMediaPipe();
        return () => {
            stopCamera();
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    const setupHandDetection = () => {
        const HandsConstructor = window.Hands;
        if (!HandsConstructor) return;

        const hands = new HandsConstructor({
            locateFile: (file: string) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });

        hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        hands.onResults(onHandsResults);
        handsRef.current = hands;

        detectHands();
    };

    const detectHands = async () => {
        if (videoRef.current && handsRef.current && cameraActive) {
            await handsRef.current.send({ image: videoRef.current });
            animationFrameRef.current = requestAnimationFrame(detectHands);
        }
    };

    const onHandsResults = (results: HandsResults) => {
        if (!canvasRef.current || !videoRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw video
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            setHandDetected(true);

            for (const landmarks of results.multiHandLandmarks) {
                // Draw hand landmarks
                drawHandLandmarks(ctx, landmarks, canvas.width, canvas.height);

                // Count extended fingers
                const extended = countExtendedFingers(landmarks);
                setFingersCount(extended);

                // Auto-capture when 5 fingers detected
                if (extended === 5 && !scanComplete) {
                    captureHandData(landmarks);
                }
            }
        } else {
            setHandDetected(false);
            setFingersCount(0);
        }
    };

    const drawHandLandmarks = (
        ctx: CanvasRenderingContext2D,
        landmarks: HandLandmark[],
        width: number,
        height: number
    ) => {
        // Draw connections
        const connections: [number, number][] = [
            [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
            [0, 5], [5, 6], [6, 7], [7, 8], // Index
            [0, 9], [9, 10], [10, 11], [11, 12], // Middle
            [0, 13], [13, 14], [14, 15], [15, 16], // Ring
            [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
            [5, 9], [9, 13], [13, 17] // Palm
        ];

        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;

        for (const [start, end] of connections) {
            ctx.beginPath();
            ctx.moveTo(landmarks[start].x * width, landmarks[start].y * height);
            ctx.lineTo(landmarks[end].x * width, landmarks[end].y * height);
            ctx.stroke();
        }

        // Draw points
        for (const landmark of landmarks) {
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(landmark.x * width, landmark.y * height, 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    };

    const countExtendedFingers = (landmarks: HandLandmark[]): number => {
        let count = 0;

        // Thumb (compare x-coordinates)
        if (Math.abs(landmarks[4].x - landmarks[3].x) > Math.abs(landmarks[3].x - landmarks[2].x)) {
            count++;
        }

        // Other fingers (compare y-coordinates)
        const fingerTips = [8, 12, 16, 20];
        const fingerPips = [6, 10, 14, 18];

        for (let i = 0; i < fingerTips.length; i++) {
            if (landmarks[fingerTips[i]].y < landmarks[fingerPips[i]].y) {
                count++;
            }
        }

        return count;
    };

    const captureHandData = (landmarks: HandLandmark[]) => {
        const handData: HandData = {
            landmarks: landmarks.map((l: HandLandmark) => ({ x: l.x, y: l.y, z: l.z })),
            timestamp: Date.now(),
            fingersExtended: 5
        };

        setCapturedData(handData);
        setScanComplete(true);
        setHandDetected(false);

        // Stop detection after capture
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    };

    const resetScan = () => {
        setScanComplete(false);
        setCapturedData(null);
        setFingersCount(0);
        if (cameraActive) {
            detectHands();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                        <div className="flex items-center gap-3">
                            <Hand className="w-8 h-8" />
                            <h1 className="text-3xl font-bold">Hand Scanner</h1>
                        </div>
                        <p className="mt-2 text-blue-100">Show all 5 fingers to scan your hand data</p>
                    </div>

                    {/* Main Content */}
                    <div className="p-6">
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                                <AlertCircle className="w-5 h-5" />
                                <p>{error}</p>
                            </div>
                        )}

                        {/* Video/Canvas Container */}
                        <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-6" style={{ aspectRatio: '16/9' }}>
                            <video
                                ref={videoRef}
                                className="absolute inset-0 w-full h-full object-cover"
                                playsInline
                                style={{ display: cameraActive ? 'block' : 'none' }}
                            />
                            <canvas
                                ref={canvasRef}
                                className="absolute inset-0 w-full h-full object-cover"
                                style={{ display: cameraActive ? 'block' : 'none' }}
                            />

                            {!cameraActive && !scanComplete && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center text-white">
                                        <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg">Camera not active</p>
                                    </div>
                                </div>
                            )}

                            {/* Status Overlay */}
                            {cameraActive && !scanComplete && (
                                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                    <div className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg">
                                        <p className="text-sm font-medium">
                                            {handDetected ? '✓ Hand Detected' : '○ No Hand Detected'}
                                        </p>
                                        <p className="text-xs mt-1">Fingers: {fingersCount}/5</p>
                                    </div>

                                    {fingersCount === 5 && (
                                        <div className="bg-green-500 text-white px-4 py-2 rounded-lg animate-pulse">
                                            <p className="text-sm font-bold">Scanning...</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Success Overlay */}
                            {scanComplete && (
                                <div className="absolute inset-0 bg-green-500 bg-opacity-90 flex items-center justify-center">
                                    <div className="text-center text-white">
                                        <CheckCircle className="w-20 h-20 mx-auto mb-4" />
                                        <h2 className="text-3xl font-bold mb-2">Scan Complete!</h2>
                                        <p className="text-lg">Hand data captured successfully</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="flex gap-3">
                            {!cameraActive ? (
                                <button
                                    onClick={startCamera}
                                    disabled={isLoading}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Loading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Camera className="w-5 h-5" />
                                            <span>Start Camera</span>
                                        </>
                                    )}
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={stopCamera}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                    >
                                        Stop Camera
                                    </button>
                                    {scanComplete && (
                                        <button
                                            onClick={resetScan}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                        >
                                            Scan Again
                                        </button>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Captured Data Display */}
                        {capturedData && (
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold text-lg mb-3 text-gray-800">Captured Hand Data</h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="bg-white p-3 rounded">
                                        <p className="text-gray-600">Landmarks</p>
                                        <p className="font-bold text-lg">{capturedData.landmarks.length}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded">
                                        <p className="text-gray-600">Fingers Extended</p>
                                        <p className="font-bold text-lg">{capturedData.fingersExtended}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded col-span-2">
                                        <p className="text-gray-600 mb-1">Timestamp</p>
                                        <p className="font-mono text-xs">{new Date(capturedData.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                                <details className="mt-3">
                                    <summary className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
                                        View Raw Data
                                    </summary>
                                    <pre className="mt-2 p-3 bg-gray-800 text-green-400 rounded text-xs overflow-auto max-h-64">
                                        {JSON.stringify(capturedData, null, 2)}
                                    </pre>
                                </details>
                            </div>
                        )}

                        {/* Instructions */}
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h3 className="font-semibold text-blue-900 mb-2">Instructions</h3>
                            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                                <li>Click Start Camera to enable your webcam</li>
                                <li>Position your hand in front of the camera</li>
                                <li>Extend all 5 fingers with palm facing the camera</li>
                                <li>The app will automatically scan and capture your hand data</li>
                                <li>Review the captured data below the video</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}