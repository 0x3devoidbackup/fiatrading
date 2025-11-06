import Image from "next/image";
import HandScanner from "./newcamera";
import HandScannerWithCapture from "./HandScannerWithCapture";
import HandOnlyCapture from "./HandOnlyCapture";
import App from "./grant";
export default function Home() {
  return (
    <main className="">
      <App />
    </main>
  );
}
