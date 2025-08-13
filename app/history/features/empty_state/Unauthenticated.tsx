import HistoryHeader from "@/app/history/features/header/HistoryHeader";

export default function Unauthenticated() {
  return (
    <div className="p-6">
      <HistoryHeader />
      <p className="opacity-80 mt-2">
        Mark shows as watched to track your history.
      </p>
    </div>
  );
}
