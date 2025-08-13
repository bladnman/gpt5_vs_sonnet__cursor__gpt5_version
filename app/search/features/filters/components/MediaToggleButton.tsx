"use client";

export default function MediaToggleButton({
  value,
  active,
  label,
  onClick,
}: {
  value: string;
  active: boolean;
  label: string;
  onClick: (value: string) => void;
}) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`px-3 py-1 rounded-md border ${
        active ? "bg-[--color-primary] text-white" : "border-[--color-border]"
      }`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}
