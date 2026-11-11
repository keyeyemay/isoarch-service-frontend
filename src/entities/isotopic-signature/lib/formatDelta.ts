export const formatDelta = (value: number | null): string =>
  value === null ? "—" : `${value.toFixed(1)} ‰`;
