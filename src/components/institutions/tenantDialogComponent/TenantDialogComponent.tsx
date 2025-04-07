import { Tenant } from "@/types/tenant";
import { ArrowRightIcon, Cross1Icon } from "@radix-ui/react-icons";
import {
  AlertDialog,
  Button,
  DataList,
  Dialog,
  Flex,
  Switch,
  Tabs,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import InvitedUsersTabComponent from "./tabs/InvitedUsersTabComponent";
import StatsTabComponent from "./tabs/StatsTabComponent";
import UsersTabComponent from "./tabs/UsersTabComponent";

interface TenantDialogComponentProps {
  tenantId: number;
  updateTenant: (tenant: Tenant) => void;
}

export default function TenantDialogComponent({
  tenantId,
  updateTenant,
}: TenantDialogComponentProps) {
  const [open, setOpen] = useState(false);
  const [edited, setEdited] = useState(false);
  const [saveAlertDialogOpen, setSaveAlertDialogOpen] = useState(false);
  const tenant = useSelector((state: { tenants: { tenants: Tenant[] } }) =>
    state.tenants.tenants.find((tenant) => tenant.id === tenantId)
  )!;

  const [localTenant, setLocalTenant] = useState(tenant);
  const [localTenantName] = useState(tenant.name);
  const [localTenantEmail] = useState(tenant.email);
  const [localTenantAddress] = useState(tenant.address);

  const handleOpen = () => {
    setLocalTenant(tenant);
    setOpen(true);
  };

  const handleClose = () => {
    if (edited) setSaveAlertDialogOpen(true);
    setOpen(false);
  };

  const handleSave = () => {
    if (localTenant) {
      updateTenant(localTenant);
    }
    setOpen(false);
  };

  useEffect(() => {
    if (localTenant != tenant) {
      setEdited(true);
    } else {
      setEdited(false);
    }
  }, [localTenant]);

  return (
    <Flex>
      <AlertDialog.Root
        open={saveAlertDialogOpen}
        onOpenChange={setSaveAlertDialogOpen}
      >
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Save changes?</AlertDialog.Title>
          <AlertDialog.Description size="2">
            You have unsaved changes. Do you want to save them before closing?
          </AlertDialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Don't save
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button variant="solid" color="red" onClick={() => handleSave()}>
                Save
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
      <Dialog.Root open={open} onOpenChange={!open ? setOpen : handleClose}>
        <Dialog.Trigger>
          <Button variant="soft" onClick={handleOpen}>
            <ArrowRightIcon height="16" width="16" />
          </Button>
        </Dialog.Trigger>
        {open && (
          <Dialog.Content maxWidth="60vw">
            <Flex>
              <Flex
                direction="column"
                gap="2"
                width="40%"
                style={{ paddingTop: 20 }}
              >
                <Dialog.Title>
                  <div
                    suppressContentEditableWarning={true}
                    contentEditable={true}
                    onInput={(e) =>
                      setLocalTenant({
                        ...localTenant,
                        name: e.currentTarget.textContent || "",
                      })
                    }
                  >
                    {localTenantName}
                  </div>
                </Dialog.Title>
                <Dialog.Description size="2" mb="4">
                  Click the text fields to edit the institution information.
                </Dialog.Description>
                <Flex gap="4">
                  <DataList.Root>
                    <DataList.Item align="center">
                      <DataList.Label minWidth="88px">Address</DataList.Label>
                      <DataList.Value>
                        <div
                          suppressContentEditableWarning={true}
                          contentEditable={true}
                          onInput={(e) =>
                            setLocalTenant({
                              ...localTenant,
                              address: e.currentTarget.textContent || "",
                            })
                          }
                        >
                          {localTenantAddress}
                        </div>
                      </DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.Label minWidth="88px">Email</DataList.Label>
                      <DataList.Value>
                        <div
                          suppressContentEditableWarning={true}
                          contentEditable={true}
                          onInput={(e) =>
                            setLocalTenant({
                              ...localTenant,
                              email: e.currentTarget.textContent || "",
                            })
                          }
                        >
                          {localTenantEmail}
                        </div>
                      </DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.Label minWidth="88px">Active</DataList.Label>
                      <DataList.Value>
                        <Switch
                          checked={localTenant.active}
                          onCheckedChange={() => {
                            setLocalTenant({
                              ...localTenant,
                              active: !localTenant.active,
                            });
                          }}
                        />
                      </DataList.Value>
                    </DataList.Item>
                  </DataList.Root>
                </Flex>
              </Flex>
              <Flex width="58%">
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
                    <StatsTabComponent tenant={tenant} />
                  </Tabs.Content>

                  <Tabs.Content
                    value="users"
                    style={{ height: "220px", overflow: "hidden" }}
                  >
                    <UsersTabComponent tenant={tenant} />
                  </Tabs.Content>

                  <Tabs.Content value="invite-user" style={{ height: "220px" }}>
                    <InvitedUsersTabComponent tenant={tenant} />
                  </Tabs.Content>
                </Tabs.Root>
              </Flex>
              <Button variant="ghost" onClick={() => handleClose()}>
                <Cross1Icon height="16" width="16" />
              </Button>
            </Flex>
          </Dialog.Content>
        )}
      </Dialog.Root>
    </Flex>
  );
}
