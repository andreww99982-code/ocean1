interface LoaderProps {
  label?: string;
}

/** Индикатор загрузки. Используется только вокруг заведомо ограниченных по времени
 * локальных операций (см. MAX_DELAY_MS в src/api/localApi.ts) — зависнуть не может. */
export function Loader({ label = "Загрузка…" }: LoaderProps) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="loader__spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
