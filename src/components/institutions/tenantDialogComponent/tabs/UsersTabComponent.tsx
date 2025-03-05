import { getUsers } from "@/modules/tenants/tenantsService";
import { toggleUser } from "@/modules/users/usersService";
import { Tenant } from "@/types/tenant";
import { User } from "@/types/user";
import { Badge, Switch, Table } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface UsersTabComponentProps {
  tenant: Tenant;
}

export default function UsersTabComponent({ tenant }: UsersTabComponentProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async (tenantId: number) => {
    setLoading(true);
    const response = await getUsers(tenantId);

    if (!response.success) {
      toast("An error occurred retrieving institution users.", {
        type: "error",
      });
      console.error(response.message);
      return;
    }

    setUsers(response.users);
    setLoading(false);
  };

  const handleToggleUser = async (userId: number) => {
    const response = await toggleUser(userId);

    if (!response.success) {
      toast("An error occurred toggling user.", { type: "error" });
      console.error(response.message);
      return;
    }

    toast("User toggled successfully.", { type: "success" });
    loadUsers(tenant.id);
  };

  useEffect(() => {
    loadUsers(tenant.id);
  }, []);

  return users.length === 0 ? (
    <Table.Row>
      <Table.Cell colSpan={6}>No users found.</Table.Cell>
    </Table.Row>
  ) : (
    <div style={{ maxHeight: "220px", overflowY: "auto" }}>
      <Table.Root>
        <Table.Body>
          {users
            .sort((a, b) => a.id - b.id)
            .map((user) => (
              <Table.Row key={user.id}>
                <Table.Cell>{user.id}</Table.Cell>
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>
                  <Badge
                    color={user.role.label == "manager" ? "yellow" : "green"}
                  >
                    {user.role.displayName}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Switch
                    onClick={() => handleToggleUser(user.id)}
                    checked={user.active}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
