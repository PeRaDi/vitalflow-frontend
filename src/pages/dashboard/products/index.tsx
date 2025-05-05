import DashboardLayout from "@/components/DashboardComponent";
import CreateItemDialogComponent from "@/components/items/CreateItemDialogComponents";
import EditItemDialogComponent from "@/components/items/EditItemDialogComponents";
import { useAuth } from "@/context/AuthContext";
import { getItems } from "@/modules/items/itemsService";
import { setItems } from "@/store/itemsSlice";
import { CriticalityLevel } from "@/types/enums";
import { Item } from "@/types/item";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  Badge,
  Card,
  Flex,
  Table,
  Tabs,
  Text,
  TextField,
} from "@radix-ui/themes";
import { CSSProperties, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function DashboardProducts() {
  const { user } = useAuth();

  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

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

  const items = useSelector((state: { items: { items: Item[] } }) => {
    return state.items.items;
  });

  const filteredItems = items
    .filter(
      (item: Item) =>
        item.id.toString().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.id - b.id);

  return (
    <DashboardLayout>
      <Flex height="98vh" direction="column" justify="between">
        <Tabs.Root defaultValue="products" style={{ height: "5vh" }}>
          <Tabs.List>
            <Tabs.Trigger value="products">Products</Tabs.Trigger>
            <Tabs.Trigger value="stocked">Stocked</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="products">
            <Flex direction="column" pt="1">
              <Card variant="ghost" style={{ height: "7vh" }}>
                <Flex
                  width="100%"
                  height="100%"
                  justify="between"
                  align="center"
                >
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
                  <CreateItemDialogComponent reloadItems={loadItems} />
                </Flex>
              </Card>
              <Card style={{ height: "89vh" }}>
                <Table.Root style={{ height: "100%" }}>
                  <Table.Header style={styles.tableHeader}>
                    <Table.Row>
                      <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>
                        Description
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>
                        Criticality
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
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
                          <Table.Cell style={styles.cell}>
                            {item.name}
                          </Table.Cell>
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
                          <Table.Cell style={styles.cell}>
                            <EditItemDialogComponent
                              item={item}
                              reloadItems={loadItems}
                            />
                          </Table.Cell>
                        </Table.Row>
                      ))
                    )}
                  </Table.Body>
                </Table.Root>
              </Card>
            </Flex>
          </Tabs.Content>
          <Tabs.Content value="stocked">
            <Flex direction="column" pt="1">
              <Card variant="ghost" style={{ height: "7vh" }}>
                <Flex
                  width="100%"
                  height="100%"
                  justify="between"
                  align="center"
                >
                  <TextField.Root
                    style={{ width: "90%" }}
                    placeholder="Search Inventory"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  >
                    <TextField.Slot>
                      <MagnifyingGlassIcon height="16" width="16" />
                    </TextField.Slot>
                  </TextField.Root>
                </Flex>
              </Card>
              <Card style={{ height: "89vh" }}>
                <Text>Stocked Items</Text>
              </Card>
            </Flex>
          </Tabs.Content>
        </Tabs.Root>
      </Flex>
    </DashboardLayout>
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
