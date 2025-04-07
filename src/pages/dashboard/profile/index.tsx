import DashboardLayout from "@/components/DashboardComponent";
import { useAuth } from "@/context/AuthContext";
import { updateUser } from "@/modules/users/usersService";
import { updateUser as updateUserStore } from "@/store/usersSlice";
import { Avatar, Badge, Card, DataList, Flex, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function DashboardProfile() {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const [localName, setLocalName] = useState("");
  const [localUsername, setLocalUsername] = useState("");
  const [localEmail, setLocalEmail] = useState("");
  const [localRole, setLocalRole] = useState("");

  useEffect(() => {
    setLocalName(user.name);
    setLocalUsername(user.username);
    setLocalEmail(user.email);
    setLocalRole(user.role.label);
  }, [user]);

  const handleSave = async () => {
    if (user) {
      if (
        localName !== user.name ||
        localUsername !== user.username ||
        localEmail !== user.email ||
        localRole !== user.role.label
      ) {
        console.log("Saving user changes...");
        const response = await updateUser(user.id, {
          localName,
          localUsername,
          localEmail,
          localRole,
        });

        if (response.success) dispatch(updateUserStore(response.data));
      }
    }
  };

  const handleCancel = () => {
    console.log("Cancelling user changes...");
    setLocalName(user.name);
    setLocalUsername(user.username);
    setLocalEmail(user.email);
    setLocalRole(user.role.label);
  };

  return (
    <DashboardLayout>
      <Flex height="98vh" direction="column" justify="start" gap="4">
        <Card
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Flex
            height="100%"
            direction="column"
            justify="center"
            align="center"
          >
            <Avatar size="8" radius="full" fallback="V" />
          </Flex>
          <div style={{ width: "100%", marginLeft: "2%" }}>
            <Card style={{ width: "100%" }}>
              <Flex direction="row" width="100%" justify="between">
                <div>
                  <Text size="4" weight="bold">
                    {localName}
                  </Text>
                  <DataList.Root style={{ marginTop: "2%" }}>
                    <DataList.Item align="center">
                      <DataList.Label minWidth="88px">Username</DataList.Label>
                      <DataList.Value>
                        <Text>{localUsername}</Text>
                      </DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.Label minWidth="88px">Email</DataList.Label>
                      <DataList.Value>
                        <Text>{localEmail}</Text>
                      </DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.Label minWidth="88px">
                        Institution
                      </DataList.Label>
                      <DataList.Value>
                        <Text>{user.tenant.name}</Text>
                      </DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.Label minWidth="88px">Role</DataList.Label>
                      <DataList.Value>
                        <Badge
                          color={
                            user.role.label === "ADMIN"
                              ? "red"
                              : user.role.label === "MANAGER"
                              ? "yellow"
                              : "green"
                          }
                        >
                          {user.role.displayName}
                        </Badge>
                      </DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.Label minWidth="88px">
                        Created At
                      </DataList.Label>
                      <DataList.Value>
                        <Text>
                          {new Date(user?.createdAt).toLocaleDateString("PT")}
                        </Text>
                      </DataList.Value>
                    </DataList.Item>
                  </DataList.Root>
                </div>
              </Flex>
            </Card>
          </div>
        </Card>
      </Flex>
    </DashboardLayout>
  );
}
