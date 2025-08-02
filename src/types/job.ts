export interface Job {
  id: string;
  itemId: number;
  queue: "TRAINER" | "FORECASTER";
  status: "SUCCESS" | "FAILED" | "PENDING";
  createdAt: Date;
  modifiedAt: Date;
  result: object | null;
}
