export enum CriticalityLevel {
  A = "A",
  B = "B",
  C = "C",
}
export const CRITICALITY_LEVEL_MAP: { [key: string]: CriticalityLevel } = {
  high: CriticalityLevel.A,
  medium: CriticalityLevel.B,
  low: CriticalityLevel.C,
};

export function parseToLevel(key: string): CriticalityLevel {
  switch (key) {
    case "High":
      return CriticalityLevel.A;
    case "Medium":
      return CriticalityLevel.B;
    default:
      return CriticalityLevel.C;
  }
}
