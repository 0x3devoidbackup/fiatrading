"use client"
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, Hand, CheckCircle, AlertCircle, Download } from 'lucide-react';

interface HandLandmark {
    x: number;
    y: number;
    z: number;
}

interface HandData {
    landmarks: HandLandmark[];
    timestamp: number;
    fingersExtended: number;
    handedness: string;
}

interface HandLandmarkerResult {
    landmarks: HandLandmark[][];
    worldLandmarks: HandLandmark[][];
    handedness: Array<{ categoryName: string; score: number }>;
}

interface HandLandmarker {
    detectForVideo: (
        video: HTMLVideoElement,
        timestamp: number
    ) => HandLandmarkerResult;
    close: () => void;
}

interface FilesetResolver {
    forVisionTasks: (wasmPath: string) => Promise<VisionTasksModule>;
}

interface VisionTasksModule {
    HandLandmarker: {
        createFromOptions: (
            vision: VisionTasksModule,
            options: HandLandmarkerOptions
        ) => Promise<HandLandmarker>;
    };
}

interface HandLandmarkerOptions {
    baseOptions: {
        modelAssetPath: string;
        delegate?: string;
    };
    numHands: number;
    runningMode: string;
    minHandDetectionConfidence?: number;
    minHandPresenceConfidence?: number;
    minTrackingConfidence?: number;
}

declare global {
    interface Window {
        FilesetResolver?: FilesetResolver;
        HandLandmarker?: {
            createFromOptions: (
                vision: VisionTasksModule,
                options: HandLandmarkerOptions
            ) => Promise<HandLandmarker>;
        };
    }
}

export default function ProofOfHandScannerApp() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [handDetected, setHandDetected] = useState(false);
    const [fingersCount, setFingersCount] = useState(0);
    const [scanComplete, setScanComplete] = useState(false);
    const [capturedData, setCapturedData] = useState<HandData | null>(null);
    const [error, setError] = useState<string>('');
    const [loadingProgress, setLoadingProgress] = useState<string>('');
    const handLandmarkerRef = useRef<HandLandmarker | null>(null);
    const animationFrameRef = useRef<number | undefined>(undefined);
    const lastVideoTimeRef = useRef<number>(-1);

const loadMediaPipe = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        // Check if already loaded
        if (window.FilesetResolver) {
            resolve();
            return;
        }

        setLoadingProgress('Loading MediaPipe library...');

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';
        script.type = 'text/javascript';
        script.crossOrigin = 'anonymous';

        script.onload = () => {
            setLoadingProgress('MediaPipe library loaded');
            resolve();
        };

        script.onerror = (error) => {
            console.error('Script load error:', error);
            setError('Failed to load MediaPipe library. Please refresh the page.');
            reject(error);
        };

        document.head.appendChild(script);
    });
};

    const waitForMediaPipe = (): Promise<void> => {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (window.FilesetResolver && window.HandLandmarker) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
        });
    };

    const drawHandLandmarks = (
        ctx: CanvasRenderingContext2D,
        landmarks: HandLandmark[],
        width: number,
        height: number
    ) => {
        // Hand connections
        const connections: [number, number][] = [
            [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
            [0, 5], [5, 6], [6, 7], [7, 8], // Index
            [0, 9], [9, 10], [10, 11], [11, 12], // Middle
            [0, 13], [13, 14], [14, 15], [15, 16], // Ring
            [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
            [5, 9], [9, 13], [13, 17] // Palm
        ];

        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;

        // Draw connections
        for (const [start, end] of connections) {
            ctx.beginPath();
            ctx.moveTo((1 - landmarks[start].x) * width, landmarks[start].y * height);
            ctx.lineTo((1 - landmarks[end].x) * width, landmarks[end].y * height);
            ctx.stroke();
        }

        // Draw landmarks
        for (const landmark of landmarks) {
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc((1 - landmark.x) * width, landmark.y * height, 6, 0, 2 * Math.PI);
            ctx.fill();

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    };

    const countExtendedFingers = (landmarks: HandLandmark[]): number => {
        let count = 0;

        // Thumb - check if tip is far from palm
        const thumbTip = landmarks[4];
        const thumbBase = landmarks[2];
        const wrist = landmarks[0];

        const thumbExtended =
            Math.abs(thumbTip.x - wrist.x) > Math.abs(thumbBase.x - wrist.x);

        if (thumbExtended) count++;

        // Other fingers - check if tip is above PIP joint
        const fingers = [
            { tip: 8, pip: 6 },   // Index
            { tip: 12, pip: 10 }, // Middle
            { tip: 16, pip: 14 }, // Ring
            { tip: 20, pip: 18 }  // Pinky
        ];

        for (const finger of fingers) {
            if (landmarks[finger.tip].y < landmarks[finger.pip].y - 0.02) {
                count++;
            }
        }

        return count;
    };

    const captureHandData = useCallback((landmarks: HandLandmark[], handedness: string) => {
        const handData: HandData = {
            landmarks: landmarks.map(l => ({ x: l.x, y: l.y, z: l.z })),
            timestamp: Date.now(),
            fingersExtended: 5,
            handedness: handedness
        };

        setCapturedData(handData);
        setScanComplete(true);
        setHandDetected(false);

        // Stop detection after capture
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    }, []);

    const processResults = useCallback((results: HandLandmarkerResult) => {
        if (!canvasRef.current || !videoRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to match video
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw video frame
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();

        if (results.landmarks && results.landmarks.length > 0) {
            setHandDetected(true);

            for (let i = 0; i < results.landmarks.length; i++) {
                const landmarks = results.landmarks[i];
                const handedness = results.handedness[i]?.categoryName || 'Unknown';

                // Draw hand landmarks
                drawHandLandmarks(ctx, landmarks, canvas.width, canvas.height);

                // Count extended fingers
                const extended = countExtendedFingers(landmarks);
                setFingersCount(extended);

                // Auto-capture when 5 fingers detected
                if (extended === 5 && !scanComplete) {
                    captureHandData(landmarks, handedness);
                }
            }
        } else {
            setHandDetected(false);
            setFingersCount(0);
        }
    }, [scanComplete, captureHandData]);

    const detectHands = useCallback(() => {
        if (!videoRef.current || !handLandmarkerRef.current || !cameraActive) {
            return;
        }

        const video = videoRef.current;
        const now = performance.now();

        if (video.currentTime !== lastVideoTimeRef.current) {
            lastVideoTimeRef.current = video.currentTime;

            try {
                const results = handLandmarkerRef.current.detectForVideo(video, now);
                processResults(results);
            } catch (err) {
                console.error('Detection error:', err);
            }
        }

        animationFrameRef.current = requestAnimationFrame(detectHands);
    }, [cameraActive, processResults]);

    const initializeHandDetection = useCallback(async () => {
        try {
            setLoadingProgress('Initializing hand detection...');

            // Wait for MediaPipe to load
            await waitForMediaPipe();

           const vision = await window.FilesetResolver!.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
);

            setLoadingProgress('Loading hand landmark model...');

            const handLandmarker = await vision.HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
                    delegate: 'GPU'
                },
                numHands: 2,
                runningMode: 'video',
                minHandDetectionConfidence: 0.5,
                minHandPresenceConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            handLandmarkerRef.current = handLandmarker;
            setLoadingProgress('Hand detection ready!');

            setTimeout(() => setLoadingProgress(''), 1000);

            detectHands();
        } catch (err) {
            console.error('Hand detection initialization error:', err);
            setError('Failed to initialize hand detection. Please refresh and try again.');
            setIsLoading(false);
        }
    }, [detectHands]);

    const stopCamera = useCallback(() => {
        if (videoRef.current?.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        setCameraActive(false);
        setHandDetected(false);
        setFingersCount(0);
    }, []);

    const startCamera = useCallback(async () => {
        setIsLoading(true);
        setError('');
        setScanComplete(false);
        setCapturedData(null);
        setLoadingProgress('Requesting camera access...');

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720, facingMode: 'user' }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setLoadingProgress('Camera connected, loading hand detection model...');

                videoRef.current.onloadedmetadata = async () => {
                    videoRef.current?.play();
                    setCameraActive(true);
                    await initializeHandDetection();
                    setIsLoading(false);
                    setLoadingProgress('');
                };
            }
        } catch (err) {
            setError('Camera access denied. Please allow camera permissions.');
            setIsLoading(false);
            setLoadingProgress('');
        }
    }, [initializeHandDetection]);

    const resetScan = useCallback(() => {
        setScanComplete(false);
        setCapturedData(null);
        setFingersCount(0);
        if (cameraActive && handLandmarkerRef.current) {
            detectHands();
        }
    }, [cameraActive, detectHands]);

    const downloadData = () => {
        if (!capturedData) return;

        const dataStr = JSON.stringify(capturedData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `hand-data-${capturedData.timestamp}.json`;
        link.click();

        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        loadMediaPipe();
        return () => {
            stopCamera();
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (handLandmarkerRef.current) {
                handLandmarkerRef.current.close();
            }
        };
    }, [stopCamera]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                        <div className="flex items-center gap-3">
                            <Hand className="w-8 h-8" />
                            <h1 className="text-3xl font-bold">Hand Scanner Pro</h1>
                        </div>
                        <p className="mt-2 text-blue-100">Advanced hand detection using MediaPipe Tasks Vision</p>
                    </div>

                    {/* Main Content */}
                    <div className="p-6">
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        {loadingProgress && (
                            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                <p className="text-blue-800">{loadingProgress}</p>
                            </div>
                        )}

                        {/* Video/Canvas Container */}
                        <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-6" style={{ aspectRatio: '16/9' }}>
                            <video
                                ref={videoRef}
                                className="absolute inset-0 w-full h-full object-cover"
                                playsInline
                                style={{ display: 'none' }}
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
                                        <p className="text-sm text-gray-400 mt-2">Click Start Camera to begin</p>
                                    </div>
                                </div>
                            )}

                            {/* Status Overlay */}
                            {cameraActive && !scanComplete && (
                                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                    <div className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
                                        <p className="text-sm font-medium">
                                            {handDetected ? '✓ Hand Detected' : '○ Searching for hands...'}
                                        </p>
                                        <p className="text-xs mt-1">Fingers Extended: {fingersCount}/5</p>
                                    </div>

                                    {fingersCount === 5 && (
                                        <div className="bg-green-500 text-white px-4 py-2 rounded-lg animate-pulse">
                                            <p className="text-sm font-bold">✓ Capturing...</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Success Overlay */}
                            {scanComplete && (
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                    <div className="text-center text-white p-8">
                                        <CheckCircle className="w-24 h-24 mx-auto mb-4 animate-bounce" />
                                        <h2 className="text-4xl font-bold mb-3">Scan Complete!</h2>
                                        <p className="text-xl mb-2">Hand data captured successfully</p>
                                        <p className="text-green-100">21 landmarks detected</p>
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
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold text-lg text-gray-800">Captured Hand Data</h3>
                                    <button
                                        onClick={downloadData}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download JSON
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                                    <div className="bg-white p-3 rounded shadow-sm">
                                        <p className="text-gray-600 text-xs">Landmarks</p>
                                        <p className="font-bold text-2xl text-blue-600">{capturedData.landmarks.length}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded shadow-sm">
                                        <p className="text-gray-600 text-xs">Fingers Extended</p>
                                        <p className="font-bold text-2xl text-green-600">{capturedData.fingersExtended}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded shadow-sm">
                                        <p className="text-gray-600 text-xs">Hand</p>
                                        <p className="font-bold text-lg">{capturedData.handedness}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded shadow-sm">
                                        <p className="text-gray-600 text-xs">Timestamp</p>
                                        <p className="font-mono text-xs">{new Date(capturedData.timestamp).toLocaleTimeString()}</p>
                                    </div>
                                </div>

                                <details className="mt-3">
                                    <summary className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium py-2">
                                        View Raw Data (Click to expand)
                                    </summary>
                                    <pre className="mt-2 p-3 bg-gray-800 text-green-400 rounded text-xs overflow-auto max-h-64 font-mono">
                                        {JSON.stringify(capturedData, null, 2)}
                                    </pre>
                                </details>
                            </div>
                        )}

                        {/* Instructions */}
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">i</span>
                                How to Use
                            </h3>
                            <ol className="text-sm text-blue-800 space-y-2">
                                <li className="flex gap-2">
                                    <span className="font-bold">1.</span>
                                    <span>Click Start Camera and allow camera permissions</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-bold">2.</span>
                                    <span>Position your hand clearly in front of the camera</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-bold">3.</span>
                                    <span>Extend all 5 fingers with palm facing the camera</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-bold">4.</span>
                                    <span>The app will automatically capture your hand data</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-bold">5.</span>
                                    <span>Download the JSON data for your records</span>
                                </li>
                            </ol>
                            <p className="text-xs text-blue-700 mt-3 italic">
                                💡 Tip: Ensure good lighting and a clear background for best results
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}