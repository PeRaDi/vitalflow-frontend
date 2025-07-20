export interface UserLog {
  userId: number;
  username: string;
  transactionType: "IN" | "OUT";
  quantity: number;
  date: Date;
}

export interface UserLogsPagination {
  hasNext: boolean;
  nextCursor?: string;
  limit: number;
}
