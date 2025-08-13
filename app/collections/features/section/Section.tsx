import PosterCard from "@/app/features/shows/PosterCard";
import type {MinimalShow} from "@/lib/tmdb/types";

export default function Section({
  title,
  items,
  footer,
}: {
  title: string;
  items: MinimalShow[];
  footer?: (item: MinimalShow) => React.ReactNode;
}) {
  if (items.length === 0) {
    return (
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex items-center justify-center py-20">
          <div className="text-sm opacity-80">No items.</div>
        </div>
      </section>
    );
  }
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col gap-1">
            <PosterCard show={item} />
            {footer ? (
              <div className="text-xs opacity-80">{footer(item)}</div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
