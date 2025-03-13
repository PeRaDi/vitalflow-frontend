import { getTenants } from "@/modules/tenants/tenantsService";
import { inviteUser } from "@/modules/users/invitedUsersService";
import { Tenant } from "@/types/tenant";
import { PlusIcon } from "@radix-ui/react-icons";
import {
  Button,
  Dialog,
  Flex,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface InviteUserDialogComponentProps {
  reloadInvitedUsers: () => void;
}

export default function InviteUserDialogComponent({
  reloadInvitedUsers,
}: InviteUserDialogComponentProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [tenant, setTenant] = useState<number>();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchTenants = async () => {
        try {
          const response = await getTenants();
          if (response.success) {
            setTenants(response.data);
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

  const handleInvite = async (e: React.FormEvent) => {
    if (!tenant || !email || !role) return;
    e.preventDefault();

    try {
      const roleId = role === "user" ? 2 : 3;
      const response = await inviteUser(tenant, email, roleId);

      if (!response.success) {
        toast("An error occurred inviting a user.", { type: "error" });
        setOpen(false);
        return;
      }
      toast("User invited successfully.", { type: "success" });
    } catch (error) {
      toast("An error occurred inviting a user.", { type: "error" });
      setOpen(false);
    } finally {
      reloadInvitedUsers();
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setEmail("");
    setRole("user");
    setTenant(undefined);
    setTenants([]);
    setOpen(false);
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
        <form onSubmit={handleInvite}>
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
              <Select.Root onValueChange={(value) => setTenant(Number(value))}>
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
            <Button type="submit">Invite</Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
