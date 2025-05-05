import { Tenant } from "@/types/tenant";
import { Flex, Text } from "@radix-ui/themes";

interface StatsTabComponentProps {
  tenant: Tenant;
}

export default function StatsTabComponent({ tenant }: StatsTabComponentProps) {
  return (
    <Flex
      direction="column"
      justify="center"
      width="100%"
      height="100%"
      gap="7"
    >
      <Flex direction="row" justify="between" width="100%">
        <Flex direction="column">
          <Text color="gray" size="2">
            Users
          </Text>
          <Text weight="bold" size="8">
            100
          </Text>
        </Flex>
        <Flex direction="column">
          <Text color="gray" size="2">
            Invited Users
          </Text>
          <Text weight="bold" size="8">
            5
          </Text>
        </Flex>
        <Flex direction="column">
          <Text color="gray" size="2">
            Items
          </Text>
          <Text weight="bold" size="8">
            1230
          </Text>
        </Flex>
      </Flex>
      <Flex direction="row" justify="between" width="100%">
        <Flex justify="between" width="100%">
          <Flex direction="column">
            <Text color="gray" size="2">
              Users
            </Text>
            <Text weight="bold" size="8">
              100
            </Text>
          </Flex>
          <Flex direction="column">
            <Text color="gray" size="2">
              Invited Users
            </Text>
            <Text weight="bold" size="8">
              5
            </Text>
          </Flex>
          <Flex direction="column">
            <Text color="gray" size="2">
              Items
            </Text>
            <Text weight="bold" size="8">
              1230
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
