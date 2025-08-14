import Image from "next/image";

export default function HeroImage({
  backdropPath,
}: {
  backdropPath?: string | null;
}) {
  if (!backdropPath) return null;
  return (
    <div className="relative">
      <Image
        src={`https://image.tmdb.org/t/p/w1280${backdropPath}`}
        alt=""
        width={1280}
        height={720}
        className="h-[40vh] w-full object-cover opacity-35"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/40 to-transparent" />
    </div>
  );
}
