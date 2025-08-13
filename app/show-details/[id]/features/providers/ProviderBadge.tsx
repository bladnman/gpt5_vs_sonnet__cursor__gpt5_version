import Image from "next/image";

export default function ProviderBadge({
  name,
  logoPath,
}: {
  name: string;
  logoPath?: string | null;
}) {
  return (
    <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md border border-[--color-border] bg-[--color-muted]">
      {logoPath ? (
        <Image
          src={`https://image.tmdb.org/t/p/w92${logoPath}`}
          alt=""
          width={18}
          height={18}
          className="rounded"
        />
      ) : (
        <div className="w-[18px] h-[18px] rounded bg-[--color-border]" />
      )}
      <span className="text-xs">{name}</span>
    </div>
  );
}
