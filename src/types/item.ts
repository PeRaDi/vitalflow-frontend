import { CriticalityLevel } from "./enums";

export interface Item {
  id: number;
  name: string;
  description: string;
  tenantId: number;
  createdAt: string;
  updatedAt: string;
  criticality: CriticalityLevel;
  leadTime: number;
  frequentOrder: boolean;
  [key: string]: any;
}
