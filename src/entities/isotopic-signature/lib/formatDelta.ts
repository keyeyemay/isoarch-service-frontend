// -19.4 -> "-19.4 ‰"
export const formatDelta = (value: number | null): string =>
  value === null ? "—" : `${value.toFixed(1)} ‰`;
