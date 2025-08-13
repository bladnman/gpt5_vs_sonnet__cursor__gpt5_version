export default function SeeAllLink({
  section,
}: {
  section: "trending" | "popular" | "now";
}) {
  return (
    <a
      className="text-sm underline opacity-80 hover:opacity-100"
      href={`/discovery/movie/${section}`}
    >
      See all
    </a>
  );
}
