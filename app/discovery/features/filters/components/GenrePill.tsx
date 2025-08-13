"use client";

export default function GenrePill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-2 py-0.5 text-xs rounded-full border",
        active
          ? "bg-[--color-muted] border-[--color-border]"
          : "opacity-80 hover:opacity-100 border-[--color-border]",
      ].join(" ")}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}
