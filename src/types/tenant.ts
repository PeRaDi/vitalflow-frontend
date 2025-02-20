export interface Tenant {
  id: number;
  name: string;
  email: string;
  address: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}
