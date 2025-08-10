import {getPopular} from "@/lib/tmdb/client";

export const dynamic = "force-dynamic";

export default async function ShowDetailsIndex() {
  // Placeholder list to navigate; proper dynamic route would be /show-details/[id]
  const popular = await getPopular("movie");
  return (
    <div className="p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Show Details</h1>
      <p className="opacity-80">Select a show to view details (WIP)</p>
      <ul className="list-disc pl-6">
        {popular.slice(0, 10).map((s) => (
          <li key={s.id}>{s.title}</li>
        ))}
      </ul>
    </div>
  );
}
