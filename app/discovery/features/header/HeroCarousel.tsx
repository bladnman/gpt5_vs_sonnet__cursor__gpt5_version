import {getHomepageSections} from "@/lib/tmdb/client";
import HeroSliderClient from "./HeroSliderClient";

export default async function HeroCarousel() {
  const {trending} = await getHomepageSections();
  const slides = trending
    .filter((s) => s.backdropPath)
    .slice(0, 5)
    .map((s) => ({
      id: s.id,
      title: s.title,
      backdropPath: s.backdropPath ?? null,
      overview: null,
    }));

  if (slides.length === 0) return null;

  return (
    <section className="relative">
      <HeroSliderClient slides={slides} />
    </section>
  );
}
