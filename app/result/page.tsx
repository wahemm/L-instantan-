"use client";

import { useEffect, useState } from "react";

export default function ResultPage() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("linstantane:lastResult");
      if (raw) {
        const parsed: unknown[] = JSON.parse(raw);
        setImages(parsed.filter((b64) => typeof b64 === "string" && b64.trim().length > 0) as string[]);
      }
    } catch {
      // nothing to show
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#FFF9EC] px-4 py-12">
      <div className="mx-auto flex max-w-2xl flex-col gap-10">
        {images.map((b64, idx) => (
          <img
            key={idx}
            src={`data:image/png;base64,${b64}`}
            alt=""
            className="w-full"
          />
        ))}
      </div>
    </main>
  );
}
