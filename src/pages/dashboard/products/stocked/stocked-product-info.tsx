import {
  createTransaction,
  getItemStats,
} from "@/modules/items/transactionsService";
import { useAppDispatch } from "@/store";
import {
  clearChartData,
  fetchItemConsumption,
} from "@/store/consumptionChartSlice";
import { ItemStats } from "@/types/item-stats";
import {
  DoubleArrowUpIcon,
  HandIcon,
  IdCardIcon,
  MinusIcon,
  Pencil1Icon,
  PlusIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import {
  Card,
  Flex,
  IconButton,
  Skeleton,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ConsumptionChart } from "./consumption-chart";
import { UserLogs } from "./user-logs";

interface StockedProductInfoProps {
  itemId: number;
  name: string;
  description: string;
}

export default function StockedProductInfo({
  itemId,
  name,
  description,
}: StockedProductInfoProps) {
  const dispatch = useAppDispatch();
  const [itemStatsLoading, setItemStatsLoading] = useState(true);
  const [itemStats, setItemStats] = useState<ItemStats>({
    total: 0,
    today: 0,
    dailyAverage: 0,
    current: 0,
  });

  useEffect(() => {
    initialLoad();
  }, [itemId, dispatch]);

  const initialLoad = () => {
    setItemStatsLoading(true);
    dispatch(clearChartData());
    loadItemStats(itemId);
  };

  const loadItemStats = async (itemId: number) => {
    try {
      const { data } = await getItemStats(itemId);
      setItemStats(data);
      dispatch(fetchItemConsumption(itemId));
      setItemStatsLoading(false);
    } catch (error) {
      console.error("Error loading item stats:", error);
    }
  };

  return (
    <Card style={{ width: "100%", height: "100%" }}>
      <Header name={name} description={description} />
      <Body
        itemId={itemId}
        stats={itemStats}
        itemStatsLoading={itemStatsLoading}
        refresh={() => initialLoad()}
      />
    </Card>
  );
}

interface HeaderProps {
  name: string;
  description: string;
}

interface BodyProps {
  itemId: number;
  stats: ItemStats;
  itemStatsLoading: boolean;
  refresh: () => void;
}

const Header = ({ name, description }: HeaderProps) => (
  <Flex direction="column" p="4">
    <Flex direction="row" width="100%" justify="between" align="center">
      <Text size="6" weight="bold">
        {name}
      </Text>
    </Flex>
    <Text size="3" color="gray">
      {description}
    </Text>
  </Flex>
);

const Body = ({ itemId, stats, itemStatsLoading, refresh }: BodyProps) => {
  const [formQuantity, setFormQuantity] = useState<number>(0);

  const handleTransaction = async (
    quantity: number,
    transactionType: number
  ) => {
    if (quantity <= 0) {
      return;
    }

    try {
      const response = await createTransaction(
        itemId,
        quantity,
        transactionType
      );

      if (!response.success) {
        toast(response.message, { type: "error" });
        return;
      }

      toast(response.message, { type: "success" });
      setFormQuantity(0);

      await refresh();
    } catch (error) {
      toast("Error creating transaction", { type: "error" });
    }
  };

  return (
    <Flex direction="column" gap="2" height="100%">
      <Flex direction="row" justify="between" gap="2" height="13.5vh">
        <Card style={{ width: "25%" }}>
          <Flex direction="column" justify="between" p="4">
            <Flex direction="row" align="center" gap="2">
              <IconButton variant="ghost">
                <Pencil1Icon />
              </IconButton>
              <Text size="5" weight="bold">
                Stock Management
              </Text>
            </Flex>
            <Flex direction="row" align="center" gap="1">
              <Text size="2" color="gray">
                Current Stock:
              </Text>
              <Skeleton loading={itemStatsLoading}>
                <Text size="2">{stats.current} items</Text>
              </Skeleton>
            </Flex>
            <Flex
              direction="row"
              align="center"
              gap="1"
              mt="4"
              width="100%"
              justify={"between"}
            >
              <TextField.Root
                type="number"
                placeholder="Quantity"
                onChange={(e) => setFormQuantity(Number(e.target.value))}
              ></TextField.Root>
              <Flex gap="2" justify="end">
                <IconButton variant="soft">
                  <PlusIcon
                    onClick={() => handleTransaction(formQuantity, 1)}
                  />
                </IconButton>
                <IconButton variant="soft" color="red">
                  <MinusIcon
                    onClick={() => handleTransaction(formQuantity, 2)}
                  />
                </IconButton>
              </Flex>
            </Flex>
          </Flex>
        </Card>
        <Card style={{ width: "75%" }}>
          <Flex direction="column" justify="between" p="4">
            <Flex direction="row" align="center" gap="2">
              <IconButton variant="ghost">
                <HandIcon />
              </IconButton>
              <Text size="5" weight="bold">
                Consumption Statistics
              </Text>
            </Flex>
            <Flex
              direction="row"
              align="center"
              gap="1"
              mt="4"
              width="100%"
              justify={"between"}
            >
              <Flex direction="column" gap="1" align="center">
                <Text color="gray">Total</Text>

                <Skeleton loading={itemStatsLoading}>
                  <Text size="4" weight="bold">
                    {stats.total} units
                  </Text>
                </Skeleton>
              </Flex>
              <Flex direction="column" gap="1" align="center">
                <Text color="gray">Today</Text>

                <Skeleton loading={itemStatsLoading}>
                  <Text size="4" weight="bold">
                    {stats.today} units
                  </Text>
                </Skeleton>
              </Flex>
              <Flex direction="column" gap="1" align="center">
                <Text color="gray">Daily Average</Text>
                <Skeleton loading={itemStatsLoading}>
                  <Text size="4" weight="bold">
                    {stats.dailyAverage} units/day
                  </Text>
                </Skeleton>
              </Flex>
            </Flex>
          </Flex>
        </Card>
      </Flex>
      <Flex direction="row" justify="between" align="center" height="33.5vh">
        <Card style={{ width: "100%" }}>
          <Flex direction="column" justify="between" p="4">
            <Flex direction="row" align="center" gap="2">
              <IconButton variant="ghost">
                <DoubleArrowUpIcon />
              </IconButton>
              <Text size="5" weight="bold">
                Consumption History
              </Text>
            </Flex>
            <Text mb="4" size="2" color="gray" mt="1">
              Last 30 days consumption pattern
            </Text>
            <ConsumptionChart />
          </Flex>
        </Card>
      </Flex>
      <Flex direction="row" justify="between" gap="2" height="33.5vh">
        <Card style={{ width: "50%", height: "100%" }}>
          <Flex direction="column" justify="between" p="4">
            <Flex direction="row" align="center" gap="2">
              <IconButton variant="ghost">
                <IdCardIcon />
              </IconButton>
              <Text size="5" weight="bold">
                Users History
              </Text>
            </Flex>
            <Text size="2" color="gray" mt="1" mb="3">
              User stock usage activity
            </Text>
            <UserLogs itemId={itemId} refresh={itemStatsLoading} />
          </Flex>
        </Card>
        <Card style={{ width: "50%" }}>
          <Flex direction="column" p="4" height="100%">
            <Flex direction="column" justify="between">
              <Flex direction="row" align="center" gap="2">
                <IconButton variant="ghost">
                  <RocketIcon />
                </IconButton>
                <Text size="5" weight="bold">
                  AI Statistics
                </Text>
              </Flex>
              <Text mb="4" size="2" color="gray" mt="1">
                Predictive analytics for stock planning
              </Text>
            </Flex>
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
};
