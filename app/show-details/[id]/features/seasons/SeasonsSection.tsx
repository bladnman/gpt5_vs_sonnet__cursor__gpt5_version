import Image from "next/image";

export default function SeasonsSection({
  seasons,
}: {
  seasons?: {
    id: number;
    name: string;
    seasonNumber: number;
    episodeCount?: number;
    posterPath?: string | null;
  }[];
}) {
  if (!seasons || seasons.length === 0) return null;
  return (
    <section className="p-6 md:p-8">
      <h2 className="text-xl font-semibold mb-3">Seasons</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {seasons.map((s) => (
          <div key={s.id} className="flex flex-col gap-2">
            <div className="relative">
              {s.posterPath ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w342${s.posterPath}`}
                  alt={s.name}
                  width={228}
                  height={342}
                  className="rounded-md border border-[--color-border] object-cover"
                />
              ) : (
                <div className="w-full aspect-[2/3] rounded-md bg-[--color-muted]" />
              )}
              <div className="absolute inset-x-0 bottom-0 p-2 text-xs bg-gradient-to-t from-black/70 to-transparent rounded-b-md">
                <div className="font-medium leading-tight">{s.name}</div>
                <div className="opacity-90 leading-tight">
                  S{s.seasonNumber} · {s.episodeCount ?? 0} episodes
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
