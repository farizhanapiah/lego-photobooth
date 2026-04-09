"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface QRCodeDisplayProps {
  url: string;
}

export default function QRCodeDisplay({ url }: QRCodeDisplayProps) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL(url, { width: 220, margin: 2, color: { dark: "#1D1D1B", light: "#FFFFFF" } }).then(setDataUrl);
  }, [url]);

  if (!dataUrl) return null;

  return (
    <div className="flex flex-col items-center gap-2 md:gap-3 lg:gap-4">
      <div className="bg-white rounded-[12px] lg:rounded-[16px] border-3 lg:border-4 border-[var(--lego-black)] p-2 md:p-3 lg:p-4 shadow-[0_3px_0_var(--lego-black)] lg:shadow-[0_4px_0_var(--lego-black)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={dataUrl} alt="QR Code" className="w-[140px] h-[140px] md:w-[180px] md:h-[180px] lg:w-[220px] lg:h-[220px]" />
      </div>
      <p className="font-[family-name:var(--font-fredoka-var)] font-bold text-[16px] md:text-[20px] lg:text-[24px] text-[var(--lego-black)]">
        Scan to Download Your Photo
      </p>
    </div>
  );
}
