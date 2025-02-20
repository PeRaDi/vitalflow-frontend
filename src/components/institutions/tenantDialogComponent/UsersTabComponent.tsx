import {
  getInvitedUsers,
  getUsers,
  inviteUser,
} from "@/modules/tenants/tenantsService";
import { toggleUser } from "@/modules/users/usersService";
import { Tenant } from "@/types/tenant";
import { User } from "@/types/user";
import { EnvelopeOpenIcon } from "@radix-ui/react-icons";
import {
  Badge,
  Box,
  Button,
  Flex,
  Select,
  Switch,
  Table,
  Tabs,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface UsersTabComponentProps {
  tenant: Tenant;
}

export default function UsersTabComponent({ tenant }: UsersTabComponentProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [invitedUsers, setInvitedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");

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

  const loadInvitedUsers = async (tenantId: number) => {
    setLoading(true);
    const response = await getInvitedUsers(tenantId);

    console.log(response);

    if (!response.success) {
      toast("An error occurred retrieving invited users.", {
        type: "error",
      });
      console.error(response.message);
      return;
    }

    setInvitedUsers(response.invitedUsers);
    setLoading(false);
  };

  const handleInvite = async (e: any) => {
    e.preventDefault();
    const roleId = role == "user" ? 2 : 3;

    const response = await inviteUser(tenant.id, email, roleId);

    console.log(response);
    if (!response.success) {
      toast("An error occurred inviting user.", { type: "error" });
      console.error(response.message);
      return;
    }

    toast("User invited successfully.", { type: "success" });
    setEmail("");
    setRole("user");
    loadInvitedUsers(tenant.id);
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
    loadInvitedUsers(tenant.id);
  }, []);

  return (
    <Tabs.Root defaultValue="stats" style={{ width: "100%" }}>
      <Tabs.List>
        <Tabs.Trigger value="stats">Statistics</Tabs.Trigger>
        <Tabs.Trigger value="users">Users</Tabs.Trigger>
        <Tabs.Trigger value="invite-user">Invite User</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content
        value="stats"
        style={{ height: "220px", overflow: "hidden" }}
      >
        <Text>Stats</Text>
      </Tabs.Content>

      <Tabs.Content
        value="users"
        style={{ height: "220px", overflow: "hidden" }}
      >
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
                        color={
                          user.role.label == "manager" ? "yellow" : "green"
                        }
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
      </Tabs.Content>

      <Tabs.Content value="invite-user" style={{ height: "220px" }}>
        <Flex direction="column" justify={"between"} style={{ height: "100%" }}>
          <div style={{ maxHeight: "150px", overflowY: "auto" }}>
            <Table.Root>
              <Table.Body>
                {invitedUsers.map((user) => (
                  <Table.Row key={user.id}>
                    <Table.Cell>{user.id}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>
                      <Badge
                        color={
                          user.role.label == "manager" ? "yellow" : "green"
                        }
                      >
                        {user.role.displayName}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color="orange">Invited</Badge>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </div>
          <Flex
            py="4"
            gap="3"
            direction="column"
            justify="between"
            style={{ width: "100%" }}
          >
            <Text size="2">Invite a new user to the institution.</Text>
            <form onSubmit={handleInvite}>
              <Flex justify="between" style={{ width: "100%", height: "100%" }}>
                <TextField.Root
                  style={{ width: "50%" }}
                  placeholder="User's email address"
                  required={true}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                >
                  <TextField.Slot>
                    <EnvelopeOpenIcon height="16" width="16" />
                  </TextField.Slot>
                </TextField.Root>
                <Select.Root defaultValue="user" onValueChange={setRole}>
                  <Select.Trigger style={{ width: "20%" }} />
                  <Select.Content>
                    <Select.Group>
                      <Select.Label>Role</Select.Label>
                      <Select.Item value="user">User</Select.Item>
                      <Select.Item value="manager">Manager</Select.Item>
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
                <Box>
                  <Flex>
                    <Button type="submit">Invite</Button>
                  </Flex>
                </Box>
              </Flex>
            </form>
          </Flex>
        </Flex>
      </Tabs.Content>
    </Tabs.Root>
  );
}
