import AddContactsDto from "@/modules/tenants/dtos/contact.dto";
import { CreateTenantDto } from "@/modules/tenants/dtos/tenant.dto";
import { addContacts, create } from "@/modules/tenants/tenantsService";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import {
  Button,
  Dialog,
  Flex,
  IconButton,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useState } from "react";
import { toast } from "react-toastify";

interface CreateTenantDialogComponentProps {
  reloadTenants: () => void;
}

export default function CreateTenantDialogComponent({
  reloadTenants,
}: CreateTenantDialogComponentProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [open, setOpen] = useState(false);

  const [contacts, setContacts] = useState<
    { index: number; contact: number; info: string }[]
  >([]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const tenant: CreateTenantDto = { name, email, address };
      const createResponse = await create(tenant);

      if (!createResponse.success) {
        toast("An error occurred creating the institution.", { type: "error" });
        setOpen(false);
        return;
      }

      if (contacts.length === 0) {
        toast("Institution created successfully.", { type: "success" });
        setOpen(false);
        return;
      }

      const tenantsContacts: AddContactsDto = {
        contacts: contacts.map((contact) => ({
          contact: contact.contact,
          info: contact.info,
        })),
      };

      const addContactsResponse = await addContacts(
        createResponse.tenant.id,
        tenantsContacts
      );

      if (!addContactsResponse.success) {
        toast("An error occured adding contacts to the institution.", {
          type: "error",
        });
        setOpen(false);
        return;
      }

      toast("Institution created successfully.", { type: "success" });
      reloadTenants();
      setOpen(false);
    } catch (error) {
      toast("An error occurred creating the institution.", { type: "error" });
      setOpen(false);
      console.error(error);
    }
  };

  const handleCancel = () => {
    setName("");
    setEmail("");
    setAddress("");
    setContacts([]);
  };

  const addContact = () => {
    setContacts((prevContacts) => [
      ...prevContacts,
      { index: Date.now(), contact: -1, info: "" },
    ]);
  };

  const removeContact = (index: number) => {
    setContacts((prevContacts) =>
      prevContacts.filter((contact) => contact.index !== index)
    );
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button style={{ width: "9%" }} variant="solid">
          <PlusIcon /> Create
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Create Institution</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Fill the form below to create a new institution.
        </Dialog.Description>
        <form onSubmit={handleSave}>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Name
              </Text>
              <TextField.Root
                placeholder="Institution name"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Email
              </Text>
              <TextField.Root
                placeholder="Institution email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Address
              </Text>
              <TextField.Root
                placeholder="Institution address"
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </label>
            <Text as="div" size="2" mb="1" weight="bold">
              Contacts
            </Text>
            {contacts.length > 0 && (
              <label>
                <Flex direction="column" gap="3">
                  {contacts.map((contact) => (
                    <Flex key={contact.index} align="center" gap="3">
                      <TextField.Root
                        placeholder="Contact"
                        type="number"
                        onChange={(e) =>
                          setContacts((prevContacts) =>
                            prevContacts.map((prevContact) =>
                              prevContact.index === contact.index
                                ? { ...prevContact, contact: +e.target.value }
                                : prevContact
                            )
                          )
                        }
                        style={{ width: "30%" }}
                      />
                      <TextField.Root
                        placeholder="Info"
                        onChange={(e) =>
                          setContacts((prevContacts) =>
                            prevContacts.map((prevContact) =>
                              prevContact.index === contact.index
                                ? { ...prevContact, info: e.target.value }
                                : prevContact
                            )
                          )
                        }
                        style={{ width: "70%" }}
                      />
                      <IconButton
                        color="red"
                        onClick={() => removeContact(contact.index)}
                      >
                        <MinusIcon height="16" width="16" />
                      </IconButton>
                    </Flex>
                  ))}
                </Flex>
              </label>
            )}

            <IconButton type="button" onClick={addContact}>
              <PlusIcon height="16" width="16" />
            </IconButton>
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
