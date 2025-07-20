import DashboardLayout from "@/components/DashboardComponent";
import { Flex, Tabs } from "@radix-ui/themes";
import TabStockedProducts from "./stocked/tab-stocked";
import TabProducts from "./tab-products";

export default function DashboardProducts() {
  return (
    <DashboardLayout>
      <Flex height="98vh" direction="column" justify="between">
        <Tabs.Root defaultValue="stocked" style={{ height: "5vh" }}>
          <Tabs.List>
            <Tabs.Trigger value="stocked">Stocked</Tabs.Trigger>
            <Tabs.Trigger value="products">All Products</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="products">
            <TabProducts />
          </Tabs.Content>
          <Tabs.Content value="stocked">
            <TabStockedProducts />
          </Tabs.Content>
        </Tabs.Root>
      </Flex>
    </DashboardLayout>
  );
}
