import DashboardLayout from "@/components/DashboardComponent";
import InviteUserDialogComponent from "@/components/users/InviteUserDialogComponent";
import { useAuth } from "@/context/AuthContext";
import { getTenantUsers } from "@/modules/tenants/tenantsService";
import { getInvitedUsers } from "@/modules/users/invitedUsersService";
import { getUsers, toggleUser, updateRole } from "@/modules/users/usersService";
import { setInvitedUsers } from "@/store/invitedUsersSlice";
import { setUsers, updateUser } from "@/store/usersSlice";
import { User } from "@/types/user";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  Button,
  Card,
  DropdownMenu,
  Flex,
  Switch,
  Table,
  Tabs,
  TextField,
} from "@radix-ui/themes";
import { CSSProperties, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function DashboardUsers() {
  const { user } = useAuth();

  const dispatch = useDispatch();
  const users = useSelector((state: { users: { users: User[] } }) => {
    return state.users.users;
  });

  const invitedUsers = useSelector(
    (state: { invitedUsers: { invitedUsers: User[] } }) => {
      return state.invitedUsers.invitedUsers;
    }
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    let response;

    if (user.role.label === "ADMIN") response = await getUsers();

    if (user.role.label === "MANAGER")
      response = await getTenantUsers(user.tenant.id);

    if (!response || !response.success) {
      toast("An error occurred retrieving users.", { type: "error" });
      return;
    }

    dispatch(setUsers(response.data));
    setLoading(false);
  };

  const loadInvitedUsers = async () => {
    setLoading(true);
    let response;

    if (user.role.label === "ADMIN") response = await getInvitedUsers();

    if (user.role.label === "MANAGER")
      response = await getInvitedUsers(user.tenant.id);

    if (!response || !response.success) {
      toast("An error occurred retrieving invited users.", { type: "error" });
      return;
    }

    dispatch(setInvitedUsers(response.data));
    setLoading(false);
  };

  const handleToggleUser = async (userId: number) => {
    const response = await toggleUser(userId);
    if (!response.success) {
      console.error(response);
      toast(response.message, { type: "error" });
      return;
    }

    const user = users.find((u) => u.id === userId);

    if (user) {
      dispatch(
        updateUser({ userId, field: "active", value: response.data.active })
      );
    }

    toast(
      "Successfully " +
        (response.data.active ? "activated" : "deactivated") +
        " user.",
      { type: "success" }
    );
  };

  const handleRoleChange = async (userId: number, role: string) => {
    const response = await updateRole(userId, role);
    if (!response.success) {
      console.error(response);
      toast(response.message, { type: "error" });
      return;
    }
    dispatch(updateUser({ userId, field: "role", value: response.data.role }));
    toast("Successfully updated user role.", { type: "success" });
  };

  useEffect(() => {
    loadUsers();
    loadInvitedUsers();
  }, []);

  const filteredUsers = users
    .filter(
      (user: User) =>
        user.id.toString().includes(searchQuery.toLowerCase()) ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.id - b.id);

  const filteredInvitedUsers = invitedUsers
    .filter(
      (invitedUser: any) =>
        invitedUser.id.toString().includes(searchQuery.toLowerCase()) ||
        invitedUser.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.id - b.id);

  return (
    <DashboardLayout>
      <Flex height="98vh" direction="column" justify="between">
        <Tabs.Root defaultValue="users" style={{ height: "5vh" }}>
          <Tabs.List>
            <Tabs.Trigger value="users">Users</Tabs.Trigger>
            <Tabs.Trigger value="invited">Invited users</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="users">
            <Flex direction="column" pt="1">
              <Card variant="ghost" style={{ height: "7vh" }}>
                <Flex
                  width="100%"
                  height="100%"
                  justify="between"
                  align="center"
                >
                  <TextField.Root
                    style={{ width: "90%" }}
                    placeholder="Search Users"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  >
                    <TextField.Slot>
                      <MagnifyingGlassIcon height="16" width="16" />
                    </TextField.Slot>
                  </TextField.Root>
                  <InviteUserDialogComponent
                    reloadInvitedUsers={loadInvitedUsers}
                  />
                </Flex>
              </Card>
              <Card style={{ height: "89vh" }}>
                <Table.Root style={{ height: "100%" }}>
                  <Table.Header style={styles.tableHeader}>
                    <Table.Row>
                      <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Active</Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body style={styles.tableBody}>
                    {loading ? (
                      <Table.Row>
                        <Table.Cell colSpan={6}>Loading...</Table.Cell>
                      </Table.Row>
                    ) : filteredUsers.length === 0 ? (
                      <Table.Row>
                        <Table.Cell colSpan={6}>No users found.</Table.Cell>
                      </Table.Row>
                    ) : (
                      filteredUsers.map((user) => (
                        <Table.Row key={user.id}>
                          <Table.Cell style={styles.cell}>{user.id}</Table.Cell>
                          <Table.Cell style={styles.cell}>
                            {user.name}
                          </Table.Cell>
                          <Table.Cell style={styles.cell}>
                            {user.email}
                          </Table.Cell>
                          <Table.Cell style={styles.cell}>
                            <DropdownMenu.Root>
                              <DropdownMenu.Trigger>
                                <Button
                                  variant="soft"
                                  color={
                                    user.role.label === "USER"
                                      ? "green"
                                      : user.role.label === "MANAGER"
                                      ? "yellow"
                                      : "red"
                                  }
                                >
                                  {user.role.displayName}
                                  <DropdownMenu.TriggerIcon />
                                </Button>
                              </DropdownMenu.Trigger>
                              <DropdownMenu.Content>
                                {user.role.label != "USER" && (
                                  <DropdownMenu.Item
                                    onClick={() =>
                                      handleRoleChange(user.id, "USER")
                                    }
                                  >
                                    User
                                  </DropdownMenu.Item>
                                )}
                                {user.role.label != "MANAGER" && (
                                  <DropdownMenu.Item
                                    onClick={() =>
                                      handleRoleChange(user.id, "MANAGER")
                                    }
                                  >
                                    Manager
                                  </DropdownMenu.Item>
                                )}
                                {user.role.label != "ADMIN" && (
                                  <DropdownMenu.Item
                                    onClick={() =>
                                      handleRoleChange(user.id, "ADMIN")
                                    }
                                  >
                                    Administrator
                                  </DropdownMenu.Item>
                                )}
                              </DropdownMenu.Content>
                            </DropdownMenu.Root>
                          </Table.Cell>
                          <Table.Cell style={styles.cell}>
                            <Switch
                              checked={user.active}
                              onClick={() => handleToggleUser(user.id)}
                            />
                          </Table.Cell>
                        </Table.Row>
                      ))
                    )}
                  </Table.Body>
                </Table.Root>
              </Card>
            </Flex>
          </Tabs.Content>
          <Tabs.Content value="invited">
            <Flex direction="column" pt="1">
              <Card variant="ghost" style={{ height: "7vh" }}>
                <Flex
                  width="100%"
                  height="100%"
                  justify="between"
                  align="center"
                >
                  <TextField.Root
                    style={{ width: "90%" }}
                    placeholder="Search Invited Users"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  >
                    <TextField.Slot>
                      <MagnifyingGlassIcon height="16" width="16" />
                    </TextField.Slot>
                  </TextField.Root>
                  <InviteUserDialogComponent
                    reloadInvitedUsers={loadInvitedUsers}
                  />
                </Flex>
              </Card>
              <Card style={{ height: "89vh" }}>
                <Table.Root style={{ height: "100%" }}>
                  <Table.Header style={styles.tableHeader}>
                    <Table.Row>
                      <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Tenant</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body style={styles.tableBody}>
                    {loading ? (
                      <Table.Row>
                        <Table.Cell colSpan={6}>Loading...</Table.Cell>
                      </Table.Row>
                    ) : filteredInvitedUsers.length === 0 ? (
                      <Table.Row>
                        <Table.Cell colSpan={6}>
                          No invited users found.
                        </Table.Cell>
                      </Table.Row>
                    ) : (
                      filteredInvitedUsers.map((user) => (
                        <Table.Row key={user.id}>
                          <Table.Cell>{user.id}</Table.Cell>
                          <Table.Cell>{user.email}</Table.Cell>
                          <Table.Cell>{user.tenant.name}</Table.Cell>
                          <Table.Cell>{user.role.displayName}</Table.Cell>
                        </Table.Row>
                      ))
                    )}
                  </Table.Body>
                </Table.Root>
              </Card>
            </Flex>
          </Tabs.Content>
        </Tabs.Root>
      </Flex>
    </DashboardLayout>
  );
}

const styles: { [key: string]: CSSProperties } = {
  tableHeader: {
    position: "sticky",
    top: 0,
    zIndex: 1,
    backgroundColor: "#1B201F",
  },
  tableBody: {
    maxHeight: "85vh",
    width: "100%",
    overflowY: "auto",
    zIndex: 0,
  },
  cell: {
    verticalAlign: "middle",
    display: "table-cell",
  },
};
