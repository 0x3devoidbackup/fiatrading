import Image from "next/image";

type CenterLoaderProps = {
  show: boolean;
};

export default function CenterLoader({ show }: CenterLoaderProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <Image
        src="/images/loader.gif"
        alt="Loading..."
        width={80}
        height={80}
        priority
      />
    </div>
  );
}
