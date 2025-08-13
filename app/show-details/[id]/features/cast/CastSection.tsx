import Image from "next/image";

export default function CastSection({
  cast,
}: {
  cast?: {
    id: number;
    name: string;
    character?: string;
    profilePath?: string | null;
  }[];
}) {
  if (!cast || cast.length === 0) return null;
  return (
    <section className="px-6 md:px-8">
      <h2 className="text-xl font-semibold mb-3">Cast</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {cast.slice(0, 14).map((c) => (
          <div key={c.id} className="flex items-center gap-3">
            {c.profilePath ? (
              <Image
                src={`https://image.tmdb.org/t/p/w185${c.profilePath}`}
                alt={c.name}
                width={40}
                height={60}
                className="rounded-md object-cover border border-[--color-border] w-10 h-14"
              />
            ) : (
              <div className="w-10 h-14 rounded-md bg-[--color-muted]" />
            )}
            <div className="text-sm">
              <div className="font-medium leading-tight">{c.name}</div>
              {c.character && (
                <div className="opacity-80 leading-tight">as {c.character}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
