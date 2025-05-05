import { createItem } from "@/modules/items/itemsService";
import { CRITICALITY_LEVEL_MAP, CriticalityLevel } from "@/types/enums";
import { Item } from "@/types/item";
import { Pencil1Icon } from "@radix-ui/react-icons";
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

interface EditItemDialogComponentProps {
  reloadItems: () => void;
  item: Item;
}

export default function EditItemDialogComponent({
  item,
  reloadItems,
}: EditItemDialogComponentProps) {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [criticality, setCriticality] = useState<CriticalityLevel | null>(
    CriticalityLevel(item.criticality)
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      console.log(item);
    }
  }, [open]);

  const handleEdit = async (e: React.FormEvent) => {
    if (!name || !description || !criticality) return;
    e.preventDefault();

    try {
      const response = await createItem(name, description, criticality);
      if (!response.success) {
        toast("An error occurred creating a new item.", { type: "error" });
        setOpen(false);
        return;
      }
      toast("New item created successfully.", { type: "success" });
    } catch (error) {
      toast("An error occurred creating a new item.", { type: "error" });
      console.error(error);
      setOpen(false);
    } finally {
      reloadItems();
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setName("");
    setDescription("");
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <IconButton variant="soft">
          <Pencil1Icon />
        </IconButton>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="400px">
        <Dialog.Title>Edit Item</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Change the form below to edit a new item.
        </Dialog.Description>
        <form onSubmit={handleEdit}>
          <Flex direction="column" gap="3" justify={"between"}>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Name
              </Text>
              <TextField.Root
                onChange={(e) => setName(e.target.value)}
                type="text"
                value={name}
                required
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Description
              </Text>
              <TextField.Root
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                value={description}
                required
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Criticality
              </Text>
              <Select.Root
                onValueChange={(value) =>
                  setCriticality(CRITICALITY_LEVEL_MAP[value])
                }
                required
              >
                <Select.Trigger style={{ width: "100%" }} />
                <Select.Content>
                  <Select.Group>
                    <Select.Item value="A">High</Select.Item>
                    <Select.Item value="B">Medium</Select.Item>
                    <Select.Item value="C">Low</Select.Item>
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
            <Button type="submit">Create</Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
