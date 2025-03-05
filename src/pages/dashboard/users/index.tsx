import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Flex, Card, Table, Switch, TextField } from "@radix-ui/themes";
import DashboardLayout from "@/components/DashboardComponent";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { User } from "@/types/user";
import { getUsers, toggleUser } from "@/modules/users/usersService";
import { setUsers, updateUser } from "@/store/usersSlice";
import InviteUserDialogComponent from "@/components/users/InviteUserDialogComponent";

export default function DashboardUsers() {
  const dispatch = useDispatch();
  const users = useSelector((state: { users: { users: User[] } }) => {
    return state.users.users;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    const response = await getUsers();

    if (!response.success) {
      toast("An error occurred retrieving users.", { type: "error" });
      console.error(response.message);
      return;
    }

    dispatch(setUsers(response.users));
    setLoading(false);
  };

  const handleToggleUser = async (userId: number) => {
    const response = await toggleUser(userId);
    if (!response.success) {
      toast("An error occurred toggling user.", { type: "error" });
      console.error(response.message);
      return;
    }

    const user = users.find((u) => u.id === userId);

    if (user) {
      dispatch(updateUser({ userId, field: "active", value: response.active }));
    }

    toast(
      "Successfully " +
        (response.active ? "activated" : "deactivated") +
        " user.",
      { type: "success" }
    );
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users
    .filter(
      (user: User) =>
        user.id.toString().includes(searchQuery.toLowerCase()) ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.id - b.id);

  return (
    <DashboardLayout>
      <Flex height="98vh" direction="column" justify="center" gap="4">
        <Card style={{ height: "5vh" }}>
          <Flex width="100%" justify="between" align="center">
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
            <InviteUserDialogComponent reloadUsers={loadUsers} />
          </Flex>
        </Card>
        <Card style={{ height: "90vh" }}>
          <Table.Root style={{ height: "100%" }}>
            <Table.Header className="table-header">
              <Table.Row>
                <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Active</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body className="table-body">
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
                    <Table.Cell>{user.id}</Table.Cell>
                    <Table.Cell>{user.name}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>
                      <Switch
                        checked={user.active}
                        onClick={() => handleToggleUser(user.id)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      {/* <UserDialogComponent
                        tenant={user}
                        updateTenant={handleUpdateUser}
                      /> */}
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Card>
      </Flex>
    </DashboardLayout>
  );
}
