interface LoaderProps {
  label?: string;
}

/** Loading indicator. Used only around operations that are strictly time-limited
 * locally (see MAX_DELAY_MS in src/api/localApi.ts) — cannot hang. */
export function Loader({ label = "Loading…" }: LoaderProps) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="loader__spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
