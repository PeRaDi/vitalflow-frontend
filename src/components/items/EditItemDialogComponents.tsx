import { updateItem } from "@/modules/items/itemsService";
import { CriticalityLevel } from "@/types/enums";
import { Item } from "@/types/item";
import { Pencil1Icon } from "@radix-ui/react-icons";
import {
  Button,
  Dialog,
  Flex,
  IconButton,
  Select,
  Switch,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useState } from "react";
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
  const [criticality, setCriticality] = useState<CriticalityLevel>(
    item.criticality as CriticalityLevel
  );
  const [leadTime, setLeadTime] = useState(item.leadTime);
  const [frequentOrder, setFrequentOrder] = useState(item.frequentOrder);
  const [open, setOpen] = useState(false);

  const handleEdit = async (e: React.FormEvent) => {
    if (!name || !description || !criticality || leadTime <= 0) return;
    e.preventDefault();

    try {
      const updatedItem = { ...item };
      updatedItem.criticality = criticality;
      updatedItem.name = name;
      updatedItem.description = description;
      updatedItem.leadTime = leadTime;
      updatedItem.frequentOrder = frequentOrder;

      const response = await updateItem(updatedItem);
      if (!response.success) {
        toast("An error occurred creating a new item.", { type: "error" });
        setOpen(false);
        return;
      }
      toast("Item update successfully.", { type: "success" });
    } catch (error) {
      toast("An error occurred updating a item.", { type: "error" });
      console.error(error);
      setOpen(false);
    } finally {
      reloadItems();
      setOpen(false);
    }
  };

  const handleCancel = () => {
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
            <Flex justify="between" align="center">
              <label style={{ width: "48%" }}>
                <Text as="div" size="2" mb="1" weight="bold">
                  Lead Time
                </Text>
                <TextField.Root
                  onChange={(e) => setLeadTime(Number(e.target.value))}
                  type="number"
                  value={leadTime}
                  required
                />
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Criticality
                </Text>
                <Select.Root
                  onValueChange={(value) => {
                    setCriticality(value as CriticalityLevel);
                  }}
                  defaultValue={item.criticality}
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
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Frequent Order
              </Text>
              <Switch
                checked={frequentOrder}
                onCheckedChange={setFrequentOrder}
              />
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
