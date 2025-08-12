"use client";
import {useOptimistic, useTransition} from "react";

export default function RatingControl({
  initial,
  onSave,
  onClear,
}: {
  initial: number | null;
  onSave: (value: number) => Promise<void>;
  onClear: () => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useOptimistic<number | null, number | null>(
    initial,
    (_state, newVal) => newVal
  );

  const commit = (next: number) => {
    startTransition(async () => {
      // toggle-off behavior: click same star clears
      if (value === next) {
        setValue(null);
        await onClear();
      } else {
        setValue(next);
        await onSave(next);
      }
    });
  };

  return (
    <div className="inline-flex items-center gap-2">
      <div className="inline-flex">
        {Array.from({length: 10}).map((_, i) => {
          const starVal = i + 1;
          const active = (value ?? 0) >= starVal;
          return (
            <button
              key={starVal}
              className={[
                "w-5 h-5 leading-none text-sm",
                active
                  ? "text-[--color-primary]"
                  : "opacity-40 hover:opacity-80",
              ].join(" ")}
              aria-label={`Rate ${starVal}`}
              aria-pressed={active}
              onClick={() => commit(starVal)}
            >
              ★
            </button>
          );
        })}
      </div>
      <span className="text-xs opacity-80">{value ?? "—"}</span>
      {isPending && <span className="text-xs opacity-60">Saving…</span>}
    </div>
  );
}
