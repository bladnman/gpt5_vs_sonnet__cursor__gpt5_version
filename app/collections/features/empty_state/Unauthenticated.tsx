import CollectionsHeader from "@/app/collections/features/header/CollectionsHeader";

export default function Unauthenticated() {
  return (
    <div className="p-6">
      <CollectionsHeader />
      <p className="opacity-80 mt-2">
        Sign in or perform an action to create a session.
      </p>
    </div>
  );
}
