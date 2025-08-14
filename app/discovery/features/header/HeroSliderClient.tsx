"use client";
import Image from "next/image";
import Link from "next/link";
import {useMemo, useState} from "react";

type Slide = {
  id: string;
  title: string;
  backdropPath: string | null;
  overview?: string | null;
};

export default function HeroSliderClient({slides}: {slides: Slide[]}) {
  const [index, setIndex] = useState(0);
  const current = slides[index] ?? slides[0];
  const backdrop = current?.backdropPath
    ? `https://image.tmdb.org/t/p/w1280${current.backdropPath}`
    : undefined;

  const detailHref = useMemo(() => {
    return `/show-details/${encodeURIComponent(current.id)}`;
  }, [current.id]);

  return (
    <div className="relative h-[38vh] w-full overflow-hidden bg-[--color-muted]">
      {backdrop && (
        <Image src={backdrop} alt="" fill className="object-cover opacity-35" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/35 to-transparent" />

      <div className="absolute left-6 right-6 bottom-6 max-w-3xl">
        <h2 className="text-3xl font-bold tracking-tight mb-2">
          {current.title}
        </h2>
        {current.overview && (
          <p className="opacity-85 max-w-xl text-sm md:text-base mb-4 line-clamp-3">
            {current.overview}
          </p>
        )}
        <div className="flex gap-3">
          <Link
            href={detailHref}
            className="px-4 py-2 rounded-md bg-[--color-primary] text-white font-medium"
          >
            More Info
          </Link>
        </div>
      </div>

      <div className="absolute bottom-4 right-6 flex gap-1">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={[
              "w-2 h-2 rounded-full",
              i === index ? "bg-[--color-primary]" : "bg-white/30",
            ].join(" ")}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
