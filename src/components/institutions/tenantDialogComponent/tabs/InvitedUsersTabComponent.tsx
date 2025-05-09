import {
  getInvitedUsers,
  inviteUser,
} from "@/modules/users/invitedUsersService";
import { Tenant } from "@/types/tenant";
import { EnvelopeOpenIcon } from "@radix-ui/react-icons";
import {
  Badge,
  Box,
  Button,
  Flex,
  Select,
  Spinner,
  Table,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface InvitedUsersTabComponentProps {
  tenant: Tenant;
}

export default function InvitedUsersTabComponent({
  tenant,
}: InvitedUsersTabComponentProps) {
  const [invitedUsers, setInvitedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");

  const loadInvitedUsers = async (tenantId: number) => {
    setLoading(true);
    const response = await getInvitedUsers(tenantId);

    if (!response.success) {
      toast(response.message, {
        type: "error",
      });
      return;
    }

    setInvitedUsers(
      response.data.sort((a: { id: number }, b: { id: number }) => a.id - b.id)
    );
    setLoading(false);
  };

  const handleInvite = async (e: any) => {
    e.preventDefault();
    const roleId = role == "user" ? 2 : 3;

    const response = await inviteUser(tenant.id, email, roleId);

    if (!response.success) {
      toast(response.message, { type: "error" });
      return;
    }

    toast(response.message, { type: "success" });
    setEmail("");
    setRole("user");
    loadInvitedUsers(tenant.id);
  };

  useEffect(() => {
    loadInvitedUsers(tenant.id);
  }, []);

  return loading ? (
    <Flex>
      <Spinner loading={loading} />
    </Flex>
  ) : (
    <Flex direction="column" justify={"between"} style={{ height: "100%" }}>
      <div style={{ maxHeight: "150px", overflowY: "auto" }}>
        <Table.Root>
          <Table.Body>
            {invitedUsers.length == 0 && (
              <Table.Row>
                <Table.Cell colSpan={6}>No invited users</Table.Cell>
              </Table.Row>
            )}
            {invitedUsers.length > 0 &&
              invitedUsers.map((user) => (
                <Table.Row key={user.id}>
                  <Table.Cell>{user.id}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    <Badge
                      color={user.role.label == "manager" ? "yellow" : "green"}
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
              required
              value={email}
              type="email"
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
  );
}
