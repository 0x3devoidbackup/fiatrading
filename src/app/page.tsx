import Image from "next/image";
import HandScanner from "./newcamera";
import HandScannerWithCapture from "./HandScannerWithCapture";
import HandOnlyCapture from "./HandOnlyCapture";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
      <HandScannerWithCapture />
    </main>
  );
}
