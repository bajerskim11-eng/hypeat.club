import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { cn } from "@/lib/utils";

export function QrImg({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    QRCode.toDataURL(value, {
      width: 360,
      margin: 1,
      color: { dark: "#14110e", light: "#f3ece4" },
      errorCorrectionLevel: "M",
    }).then((url) => {
      if (live) setSrc(url);
    });
    return () => {
      live = false;
    };
  }, [value]);

  if (!src) {
    return <div className={cn("aspect-square rounded-md bg-muted", className)} aria-hidden />;
  }

  return <img src={src} alt={label} className={cn("aspect-square rounded-md bg-card", className)} />;
}
