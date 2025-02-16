import DashboardLayout from "@/components/DashboardComponent";
import {
  ArrowRightIcon,
  DotsVerticalIcon,
  MagnifyingGlassIcon,
  MinusIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  IconButton,
  Skeleton,
  Switch,
  Table,
  Text,
  TextField,
} from "@radix-ui/themes";
import "./tenants.css";
import { useEffect, useState } from "react";
import { getTenants } from "@/modules/tenants/tenantsService";
import { Tenant } from "@/types/tenant";
import { toast } from "react-toastify";
import CreateTenantDialogComponent from "@/components/institutions/CreateTenantDialogComponent";

export default function DashboardTenants() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tenants, setTenants] = useState([] as Tenant[]);
  const [loading, setLoading] = useState(true);

  const loadTenants = async () => {
    setLoading(true);
    const response = await getTenants();

    if (!response.success) {
      toast("An error occurred retrieving institutions.", { type: "error" });
      console.error(response.message);
      return;
    }

    setTenants(response.tenants);
    setLoading(false);
  };

  useEffect(() => {
    loadTenants();
  }, []);

  const loadingRows = Array.from({ length: 50 }).map((_, index) => (
    <Table.Row key={index}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Table.Cell key={index}>
          <Skeleton loading={true}>Loading...</Skeleton>
        </Table.Cell>
      ))}
    </Table.Row>
  ));

  const noTenantsFound = (
    <Table.Row>
      <Table.Cell colSpan={6}>
        <Flex height="100%" align="center" justify="center">
          No institutions found.
        </Flex>
      </Table.Cell>
    </Table.Row>
  );

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (searchQuery.includes("@") &&
        tenant.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      tenant.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <Flex height="98vh" direction="column" justify="center" gap="4">
        <Card style={{ height: "5vh" }}>
          <Flex width="100%" justify="between" align="center">
            <TextField.Root
              style={{ width: "90%" }}
              placeholder="Search Institutions…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            >
              <TextField.Slot>
                <MagnifyingGlassIcon height="16" width="16" />
              </TextField.Slot>
            </TextField.Root>

            <CreateTenantDialogComponent reloadTenants={loadTenants} />
          </Flex>
        </Card>
        <Card style={{ height: "90vh" }}>
          <Table.Root style={{ height: "100%" }}>
            <Table.Header className="table-header">
              <Table.Row>
                <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Address</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Active</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body className="table-body">
              {loading && loadingRows.map((row) => row)}
              {!loading && filteredTenants.length === 0 && noTenantsFound}
              {!loading &&
                filteredTenants.map((tenant) => (
                  <Table.Row key={tenant.id}>
                    <Table.Cell>
                      <Flex height="100%" align="center">
                        {tenant.id}
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex height="100%" align="center">
                        {tenant.name}
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex height="100%" align="center">
                        {tenant.email}
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex height="100%" align="center">
                        {tenant.address}
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex height="100%" align="center">
                        <Switch checked={tenant.active} />
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex height="100%" align="center">
                        <Button variant="soft">
                          <ArrowRightIcon height="16" width="16" />
                        </Button>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table.Root>
        </Card>
      </Flex>
    </DashboardLayout>
  );
}
