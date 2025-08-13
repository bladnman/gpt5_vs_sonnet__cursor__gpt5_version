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
        className="h-[28vh] w-full object-cover opacity-35"
        priority
      />
    </div>
  );
}
