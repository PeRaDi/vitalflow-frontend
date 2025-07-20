import { getStockedItemsOverview } from "@/modules/items/transactionsService";
import { setStockedItems } from "@/store/stockedItemsSlice";
import { StockedItemOverview } from "@/types/stocked-item-overview";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { EraserIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  Badge,
  Card,
  Flex,
  IconButton,
  ScrollArea,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import StockedProductInfo from "./stocked-product-info";

export default function TabStockedProducts() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>({
    itemId: -1,
    name: "",
    description: "",
  });

  const stockedItems = useSelector(
    (state: { stockedItems: { stockedItems: StockedItemOverview[] } }) => {
      return state.stockedItems.stockedItems;
    }
  );

  useEffect(() => {
    loadStockedItems();
  }, []);

  const loadStockedItems = async () => {
    try {
      setLoading(true);
      const response = await getStockedItemsOverview();

      if (!response || !response.success) {
        toast("An error occurred retrieving stocked items.", { type: "error" });
        return;
      }

      const stockedItems = response.data ? response.data : [];
      dispatch(setStockedItems(stockedItems));
    } catch (error) {
      toast("An error occurred retrieving stocked items.", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex direction="row" mt="2" gap="2" style={{ height: "94vh" }}>
      <Card style={{ width: "20%" }}>
        <Flex direction="column" justify="between" gap="2">
          <Text size="6" weight="bold">
            Stocked Products
          </Text>
          <Flex direction="row" justify="between" align="center">
            <Text color="gray" size="2">
              {stockedItems.reduce(
                (acc, product) => acc + product.currentStock,
                0
              )}{" "}
              available items
            </Text>
            <IconButton
              variant="soft"
              onClick={() =>
                setSelectedProduct({
                  itemId: -1,
                  name: "",
                  description: "",
                  active: false,
                })
              }
            >
              <EraserIcon height="16" width="16" />
            </IconButton>
          </Flex>
        </Flex>
        <Separator style={{ margin: "10px 0", width: "100%" }} />
        <Flex direction="column" gap="2" mt="2">
          <TextField.Root
            style={{ width: "100%" }}
            placeholder="Search Inventory"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>
          <ScrollArea
            type="auto"
            scrollbars="vertical"
            style={{ height: "80vh" }}
          >
            <Flex direction="column" gap="2" pr="3">
              {stockedItems
                .filter((stockedItem) =>
                  stockedItem.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((stockedItem) => (
                  <Card
                    variant="classic"
                    key={stockedItem.itemId}
                    onClick={() =>
                      setSelectedProduct({
                        itemId: stockedItem.itemId,
                        name: stockedItem.name,
                        description: stockedItem.description,
                        active: stockedItem.active,
                      })
                    }
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedProduct.itemId === stockedItem.itemId
                          ? "#1F2D27"
                          : "",
                      border:
                        selectedProduct.itemId === stockedItem.itemId
                          ? "1px solid #38a46c"
                          : "none",
                    }}
                  >
                    <Flex direction="column" justify="between">
                      <Text size="3" weight={"bold"}>
                        {stockedItem.name}
                      </Text>
                      <Flex justify="between" align="center">
                        <Text size="2" color="gray">
                          Stock: {stockedItem.currentStock} items
                        </Text>
                        <Badge color={stockedItem.active ? "green" : "red"}>
                          {stockedItem.active ? "Active" : "Inactive"}
                        </Badge>
                      </Flex>
                    </Flex>
                  </Card>
                ))}
            </Flex>
          </ScrollArea>
        </Flex>
      </Card>
      <Card style={{ width: "80%" }}>
        {selectedProduct.itemId === -1 && (
          <Flex
            direction="column"
            justify="center"
            gap="2"
            align="center"
            height="100%"
          >
            <Text color="gray" size={"2"}>
              Select a product to view details.
            </Text>
          </Flex>
        )}
        {selectedProduct.itemId !== -1 && (
          <StockedProductInfo
            itemId={selectedProduct.itemId}
            name={selectedProduct.name}
            description={selectedProduct.description}
          />
        )}
      </Card>
    </Flex>
  );
}
