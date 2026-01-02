import { Loader2 } from "lucide-react";
type CenterLoaderProps = {
  show: boolean;
};

export default function CenterLoader({ show }: CenterLoaderProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      <div className="flex flex-col items-center border border-[#333332] bg-[#333332] py-2 px-4 rounded">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
        <p className="text-sm font-thin">Loading</p>
      </div>
    </div>
  );
}
