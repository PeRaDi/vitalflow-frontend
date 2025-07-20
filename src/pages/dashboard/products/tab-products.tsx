import CreateItemDialogComponent from "@/components/items/CreateItemDialogComponents";
import EditItemDialogComponent from "@/components/items/EditItemDialogComponents";
import { useAuth } from "@/context/AuthContext";
import { getItems, toggleItem } from "@/modules/items/itemsService";
import { setItems, updateItem } from "@/store/itemsSlice";
import { CriticalityLevel } from "@/types/enums";
import { Item } from "@/types/item";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Badge, Card, Flex, Switch, Table, TextField } from "@radix-ui/themes";
import { CSSProperties, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function TabProducts() {
  const dispatch = useDispatch();
  const { user } = useAuth();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await getItems();

      if (!response || !response.success) {
        toast("An error occurred retrieving items.", { type: "error" });
        return;
      }
      const items = response.data ? response.data : [];

      dispatch(setItems(items));
    } catch (error) {
      toast("An error occurred retrieving items.", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const items = useSelector((state: { items: { items: Item[] } }) => {
    return state.items.items;
  });

  const handleToggleItem = async (itemId: number) => {
    const response = await toggleItem(itemId);
    if (!response.success) {
      console.error(response);
      toast(response.message, { type: "error" });
      return;
    }

    const item = items.find((u) => u.id === itemId);

    if (item) {
      dispatch(
        updateItem({ itemId, field: "active", value: response.data.active })
      );
    }

    toast(
      "Successfully " +
        (response.data.active ? "activated" : "deactivated") +
        " item.",
      { type: "success" }
    );
  };

  const filteredItems = items
    .filter(
      (item: Item) =>
        item.id.toString().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.id - b.id);

  return (
    <Flex direction="column" pt="1">
      <Card variant="ghost" style={{ height: "7vh" }}>
        <Flex width="100%" height="100%" justify="between" align="center">
          <TextField.Root
            style={{ width: "90%" }}
            placeholder="Search Products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>
          {user.role.label === "MANAGER" && (
            <CreateItemDialogComponent reloadItems={loadItems} />
          )}
        </Flex>
      </Card>
      <Card style={{ height: "89vh" }}>
        <Table.Root style={{ height: "100%" }}>
          <Table.Header style={styles.tableHeader}>
            <Table.Row>
              <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Criticality</Table.ColumnHeaderCell>
              {user.role.label === "MANAGER" && (
                <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
              )}
            </Table.Row>
          </Table.Header>
          <Table.Body style={styles.tableBody}>
            {loading ? (
              <Table.Row>
                <Table.Cell colSpan={6}>Loading...</Table.Cell>
              </Table.Row>
            ) : filteredItems.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={6}>No products found.</Table.Cell>
              </Table.Row>
            ) : (
              filteredItems.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell style={styles.cell}>{item.id}</Table.Cell>
                  <Table.Cell style={styles.cell}>{item.name}</Table.Cell>
                  <Table.Cell style={styles.cell}>
                    {item.description}
                  </Table.Cell>
                  <Table.Cell style={styles.cell}>
                    <Flex
                      justify="center"
                      align="center"
                      style={{ width: "50%" }}
                    >
                      <Badge
                        color={
                          item.criticality === CriticalityLevel.A
                            ? "red"
                            : item.criticality === CriticalityLevel.B
                            ? "yellow"
                            : "green"
                        }
                        variant="soft"
                        radius="large"
                      >
                        {item.criticality}
                      </Badge>
                    </Flex>
                  </Table.Cell>
                  {user.role.label === "MANAGER" && (
                    <Table.Cell style={styles.cell}>
                      <Flex justify="between" align="center">
                        <Switch
                          onClick={() => handleToggleItem(item.id)}
                          checked={item.active}
                        />
                        <EditItemDialogComponent
                          item={item}
                          reloadItems={loadItems}
                        />
                      </Flex>
                    </Table.Cell>
                  )}
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Card>
    </Flex>
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
