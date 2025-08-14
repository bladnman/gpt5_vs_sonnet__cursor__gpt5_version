export default function SeeAllLink({
  section,
}: {
  section: "trending" | "popular" | "now";
}) {
  return (
    <a
      className="text-sm opacity-80 hover:opacity-100 px-2 py-1 rounded-md hover:bg-[--color-muted]"
      href={`/discovery/movie/${section}`}
    >
      See all
    </a>
  );
}
