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
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
        {cast.slice(0, 16).map((c) => (
          <div key={c.id} className="flex flex-col items-center text-center">
            {c.profilePath ? (
              <Image
                src={`https://image.tmdb.org/t/p/w185${c.profilePath}`}
                alt={c.name}
                width={72}
                height={72}
                className="rounded-full object-cover border border-[--color-border] w-18 h-18"
              />
            ) : (
              <div className="w-18 h-18 rounded-full bg-[--color-muted]" />
            )}
            <div className="mt-2 text-xs leading-tight max-w-[9rem] truncate">
              <div className="font-medium" title={c.name}>
                {c.name}
              </div>
              {c.character && (
                <div className="opacity-80 truncate" title={c.character}>
                  {c.character}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
