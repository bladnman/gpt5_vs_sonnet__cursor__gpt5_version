import {getAllGenres} from "@/lib/tmdb/client";
import DiscoveryFilters from "./DiscoveryFilters";

export default async function DiscoveryFiltersServer() {
  const genres = await getAllGenres();
  return <DiscoveryFilters genres={genres} />;
}
