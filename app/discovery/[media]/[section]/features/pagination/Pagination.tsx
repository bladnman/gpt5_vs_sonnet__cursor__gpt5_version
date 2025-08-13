export default function Pagination({
  basePath,
  page,
  totalPages,
}: {
  basePath: string;
  page: number;
  totalPages?: number;
}) {
  return (
    <nav className="flex items-center justify-center gap-3">
      {page > 1 && (
        <a
          className="px-3 py-1 rounded-md border border-[--color-border]"
          href={`${basePath}?page=${page - 1}`}
        >
          Previous
        </a>
      )}
      {totalPages && page < totalPages && (
        <a
          className="px-3 py-1 rounded-md border border-[--color-border]"
          href={`${basePath}?page=${page + 1}`}
        >
          Next
        </a>
      )}
    </nav>
  );
}
