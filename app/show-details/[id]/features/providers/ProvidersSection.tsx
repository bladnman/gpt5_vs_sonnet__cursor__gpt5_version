import ProviderBadge from "./ProviderBadge";

export default function ProvidersSection({
  providers,
}: {
  providers?: {
    flatrate?: {id: number; name: string; logoPath?: string | null}[];
    buy?: {id: number; name: string; logoPath?: string | null}[];
    rent?: {id: number; name: string; logoPath?: string | null}[];
  };
}) {
  if (!providers) return null;
  const {flatrate, buy, rent} = providers;
  return (
    <section className="p-6 md:p-8">
      <h2 className="text-xl font-semibold mb-3">Where to watch</h2>
      <div className="flex flex-wrap gap-3 text-sm">
        {flatrate && flatrate.length > 0 && (
          <div>
            <div className="opacity-80 mb-1">Streaming</div>
            <div className="flex flex-wrap gap-2">
              {flatrate.map((p) => (
                <ProviderBadge
                  key={`f-${p.id}`}
                  name={p.name}
                  logoPath={p.logoPath}
                />
              ))}
            </div>
          </div>
        )}
        {buy && buy.length > 0 && (
          <div>
            <div className="opacity-80 mb-1">Buy</div>
            <div className="flex flex-wrap gap-2">
              {buy.map((p) => (
                <ProviderBadge
                  key={`b-${p.id}`}
                  name={p.name}
                  logoPath={p.logoPath}
                />
              ))}
            </div>
          </div>
        )}
        {rent && rent.length > 0 && (
          <div>
            <div className="opacity-80 mb-1">Rent</div>
            <div className="flex flex-wrap gap-2">
              {rent.map((p) => (
                <ProviderBadge
                  key={`r-${p.id}`}
                  name={p.name}
                  logoPath={p.logoPath}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
