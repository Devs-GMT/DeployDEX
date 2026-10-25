import { Kit, kitSrcSet } from "@/components/kit/kit";
import { KIT_RASTER } from "@/lib/config";
import { cn } from "@/lib/utils";

export function KitInBox({ className }: { className?: string }) {
  if (KIT_RASTER) {
    return (
      <div className={cn("kit-pic kit-pic-shadow relative aspect-square", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element -- static HD render with a hand-built srcset */}
        <img
          src="/kit/404-512.webp"
          srcSet={kitSrcSet("404")}
          sizes="320px"
          width={1024}
          height={1024}
          alt=""
          aria-hidden
          draggable={false}
          className="absolute inset-0 h-full w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className={cn("relative aspect-square", className)}>
      <Kit pose="dev" className="absolute inset-0" />
      <svg
        viewBox="0 0 200 200"
        aria-hidden
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <path d="M28 126 L8 96 L72 88 L88 122 Z" fill="#a96b3b" />
        <path d="M172 126 L192 96 L128 88 L112 122 Z" fill="#a96b3b" />
        <path
          d="M28 122 H172 L164 184 C140 192 60 192 36 184 Z"
          fill="#c98c52"
          stroke="#8f5527"
          strokeWidth="2"
        />
        <path d="M28 122 H172 L168 134 H32 Z" fill="#e0a969" />
        <path d="M94 122 H106 L103 188 H97 Z" fill="#e8c08c" opacity="0.7" />
        <rect x="46" y="146" width="46" height="28" rx="3" fill="#f4e3c8" />
        <path d="M53 155 H85 M53 162 H76" stroke="#a96b3b" strokeWidth="3" strokeLinecap="round" />
        <circle cx="72" cy="122" r="9" fill="#ffe4c8" />
        <circle cx="128" cy="122" r="9" fill="#ffe4c8" />
      </svg>
    </div>
  );
}
