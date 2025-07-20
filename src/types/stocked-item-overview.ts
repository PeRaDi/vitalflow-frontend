export interface StockedItemOverview {
  itemId: number;
  name: string;
  description: string;
  active: boolean;
  currentStock: number;
  [key: string]: any;
}
