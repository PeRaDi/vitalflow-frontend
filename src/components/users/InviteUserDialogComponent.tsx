import AddContactsDto from "@/modules/tenants/dtos/contact.dto";
import { CreateTenantDto } from "@/modules/tenants/dtos/tenant.dto";
import {
  addContacts,
  create,
  getTenants,
} from "@/modules/tenants/tenantsService";
import { Tenant } from "@/types/tenant";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import {
  Button,
  Dialog,
  Flex,
  IconButton,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface InviteUserDialogComponentProps {
  reloadUsers: () => void;
}

export default function InviteUserDialogComponent({
  reloadUsers,
}: InviteUserDialogComponentProps) {
  // const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [tenant, setTenant] = useState("");
  const [tenants, setTenants] = useState<Tenant[]>([]);
  // const [address, setAddress] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchTenants = async () => {
        try {
          const response = await getTenants();
          if (response.success) {
            setTenants(response.tenants);
          } else {
            toast("Failed to load tenants.", { type: "error" });
          }
        } catch (error) {
          toast("An error occurred while fetching tenants.", { type: "error" });
          console.error(error);
        }
      };
      fetchTenants();
    }
  }, [open]);

  // const [contacts, setContacts] = useState<
  //   { index: number; contact: number; info: string }[]
  // >([]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(email, role, tenant);

    //   try {
    //     const tenant: CreateTenantDto = { name, email, address };
    //     const createResponse = await create(tenant);

    //     if (!createResponse.success) {
    //       toast("An error occurred creating the institution.", { type: "error" });
    //       setOpen(false);
    //       return;
    //     }

    //     if (contacts.length === 0) {
    //       toast("Institution created successfully.", { type: "success" });
    //       setOpen(false);
    //       return;
    //     }

    //     const tenantsContacts: AddContactsDto = {
    //       contacts: contacts.map((contact) => ({
    //         contact: contact.contact,
    //         info: contact.info,
    //       })),
    //     };

    //     const addContactsResponse = await addContacts(
    //       createResponse.tenant.id,
    //       tenantsContacts
    //     );

    //     if (!addContactsResponse.success) {
    //       toast("An error occured adding contacts to the institution.", {
    //         type: "error",
    //       });
    //       setOpen(false);
    //       return;
    //     }

    //     toast("Institution created successfully.", { type: "success" });
    //     reloadTenants();
    //     setOpen(false);
    //   } catch (error) {
    //     toast("An error occurred creating the institution.", { type: "error" });
    //     setOpen(false);
    //     console.error(error);
    //   }
  };

  const handleCancel = () => {
    setEmail("");
    setRole("");
    setOpen(false);
    setTenants([]);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button style={{ width: "9%" }} variant="solid">
          <PlusIcon /> Invite User
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="600px">
        <Dialog.Title>Invite User</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Fill the form below to invite a new user to a tenant.
        </Dialog.Description>
        <form onSubmit={handleSave}>
          <Flex direction="row" gap="3" justify={"between"}>
            <label style={{ width: "35%" }}>
              <Text as="div" size="2" mb="1" weight="bold">
                Email
              </Text>
              <TextField.Root
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                value={email}
                required
              />
            </label>
            <label style={{ width: "20%" }}>
              <Text as="div" size="2" mb="1" weight="bold">
                Role
              </Text>
              <Select.Root value={role} onValueChange={setRole}>
                <Select.Trigger style={{ width: "100%" }} />
                <Select.Content>
                  <Select.Group>
                    <Select.Label>Role</Select.Label>
                    <Select.Item value="user">User</Select.Item>
                    <Select.Item value="manager">Manager</Select.Item>
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </label>
            <label style={{ width: "35%" }}>
              <Text as="div" size="2" mb="1" weight="bold">
                Tenant
              </Text>
              <Select.Root value={tenant} onValueChange={setTenant}>
                <Select.Trigger mb="2" style={{ width: "100%" }} />
                <Select.Content>
                  <Select.Group>
                    <Select.Label>Tenants</Select.Label>
                    {tenants.map((tenant) => (
                      <Select.Item key={tenant.id} value={String(tenant.id)}>
                        {tenant.name}
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </label>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray" onClick={handleCancel}>
                Cancel
              </Button>
            </Dialog.Close>
            <Button type="submit">Save</Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
