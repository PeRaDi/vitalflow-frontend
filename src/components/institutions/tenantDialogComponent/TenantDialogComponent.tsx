import { Tenant } from "@/types/tenant";
import { ArrowRightIcon, Cross1Icon } from "@radix-ui/react-icons";
import {
  AlertDialog,
  Button,
  DataList,
  Dialog,
  Flex,
  Switch,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import UsersTabComponent from "./UsersTabComponent";

interface TenantDialogComponentProps {
  tenant: Tenant;
  updateTenant: (tenant: Tenant) => void;
}

export default function TenantDialogComponent({
  tenant,
  updateTenant,
}: TenantDialogComponentProps) {
  const [open, setOpen] = useState(false);
  const [edited, setEdited] = useState(false);
  const [saveAlertDialogOpen, setSaveAlertDialogOpen] = useState(false);

  const [name, setName] = useState(tenant.name);
  const [email, setEmail] = useState(tenant.email);
  const [address, setAddress] = useState(tenant.address);
  const [active, setActive] = useState(tenant.active);

  const handleClose = () => {
    if (edited) {
      setSaveAlertDialogOpen(true);
    }
    setOpen(false);
  };

  const handleSave = () => {
    updateTenant({
      ...tenant,
      name,
      email,
      address,
      active,
    });
    setOpen(false);
  };

  useEffect(() => {
    if (
      name !== tenant.name ||
      email !== tenant.email ||
      address !== tenant.address ||
      active !== tenant.active
    ) {
      setEdited(true);
    } else {
      setEdited(false);
    }
  }, [name, email, address, active]);

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
          <Button variant="soft">
            <ArrowRightIcon height="16" width="16" />
          </Button>
        </Dialog.Trigger>
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
                  onInput={(e) => setName(e.currentTarget.textContent || "")}
                >
                  {tenant.name}
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
                          setAddress(e.currentTarget.textContent || "")
                        }
                      >
                        {tenant.address}
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
                          setEmail(e.currentTarget.textContent || "")
                        }
                      >
                        {tenant.email}
                      </div>
                    </DataList.Value>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.Label minWidth="88px">Active</DataList.Label>
                    <DataList.Value>
                      <Switch
                        checked={active}
                        onCheckedChange={(checked) => setActive(checked)}
                      ></Switch>
                    </DataList.Value>
                  </DataList.Item>
                </DataList.Root>
              </Flex>
            </Flex>
            <Flex width="58%">
              <UsersTabComponent tenant={tenant} />
            </Flex>
            <Button variant="ghost" onClick={() => handleClose()}>
              <Cross1Icon height="16" width="16" />
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );
}
