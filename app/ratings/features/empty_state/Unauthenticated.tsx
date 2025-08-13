import RatingsHeader from "@/app/ratings/features/header/RatingsHeader";

export default function Unauthenticated() {
  return (
    <div className="p-6">
      <RatingsHeader />
      <p className="opacity-80 mt-2">Rate a show to see it listed here.</p>
    </div>
  );
}
