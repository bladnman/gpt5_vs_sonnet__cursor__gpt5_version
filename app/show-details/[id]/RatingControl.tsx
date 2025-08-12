"use client";
import {useOptimistic, useTransition} from "react";

export default function RatingControl({
  initial,
  onSave,
}: {
  initial: number | null;
  onSave: (value: number) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useOptimistic<number | null, number | null>(
    initial,
    (_state, newVal) => newVal
  );

  const commit = (next: number) => {
    startTransition(async () => {
      setValue(next);
      await onSave(next);
    });
  };

  return (
    <div className="inline-flex items-center gap-2">
      <label className="text-xs opacity-80">Rate</label>
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={value ?? 5}
        onChange={(e) => commit(Number(e.target.value))}
      />
      <span className="text-xs opacity-80">{value ?? "—"}</span>
      {isPending && <span className="text-xs opacity-60">Saving…</span>}
    </div>
  );
}
