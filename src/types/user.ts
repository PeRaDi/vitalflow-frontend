import { Role } from "./role";
import { Tenant } from "./tenant";

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  tenant: Tenant;
  role: Role;
  createdAt: string;
  updatedAt: string;
}
