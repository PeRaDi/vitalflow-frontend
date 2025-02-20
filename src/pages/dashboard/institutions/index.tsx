import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTenants, toggle, update } from "@/modules/tenants/tenantsService";
import { Tenant } from "@/types/tenant";
import { toast } from "react-toastify";
import { Flex, Card, Table, Switch, TextField } from "@radix-ui/themes";
import CreateTenantDialogComponent from "@/components/institutions/CreateTenantDialogComponent";
import { setTenants, updateTenant } from "@/store/tenantsSlice";
import DashboardLayout from "@/components/DashboardComponent";
import TenantDialogComponent from "@/components/institutions/tenantDialogComponent/TenantDialogComponent";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import "./tenants.css";

export default function DashboardTenants() {
  const dispatch = useDispatch();
  const tenants = useSelector(
    (state: { tenants: { tenants: Tenant[] } }) => state.tenants.tenants
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const loadTenants = async () => {
    setLoading(true);
    const response = await getTenants();

    if (!response.success) {
      toast("An error occurred retrieving institutions.", { type: "error" });
      console.error(response.message);
      return;
    }

    dispatch(setTenants(response.tenants));
    setLoading(false);
  };

  const dispatchTenantFullUpdate = (tenant: Tenant) => {
    dispatch(
      updateTenant({
        tenantId: tenant.id,
        field: "name",
        value: tenant.name,
      })
    );
    dispatch(
      updateTenant({
        tenantId: tenant.id,
        field: "email",
        value: tenant.email,
      })
    );
    dispatch(
      updateTenant({
        tenantId: tenant.id,
        field: "address",
        value: tenant.address,
      })
    );
    dispatch(
      updateTenant({
        tenantId: tenant.id,
        field: "active",
        value: tenant.active,
      })
    );
  };

  const handleUpdateTenant = async (tenant: Tenant) => {
    const response = await update(tenant);
    if (!response.success) {
      toast("An error occurred updating institution.", { type: "error" });
      console.error(response.message);
      return;
    }

    dispatchTenantFullUpdate(tenant);

    toast(
      "Successfully " +
        (response.active ? "activated" : "deactivated") +
        " institution.",
      { type: "success" }
    );
  };

  const handleToggleTenant = async (tenantId: number) => {
    const response = await toggle(tenantId);
    if (!response.success) {
      toast("An error occurred toggling institution.", { type: "error" });
      console.error(response.message);
      return;
    }
    const tenant = tenants.find((t) => t.id === tenantId);
    if (tenant) {
      dispatch(
        updateTenant({ tenantId, field: "active", value: response.active })
      );
    }
    console.log(typeof response.active);
    toast(
      "Successfully " +
        (response.active ? "activated" : "deactivated") +
        " institution.",
      { type: "success" }
    );
  };

  useEffect(() => {
    loadTenants();
  }, []);

  const filteredTenants = tenants
    .filter(
      (tenant: Tenant) =>
        tenant.id.toString().includes(searchQuery.toLowerCase()) ||
        tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.address.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.id - b.id);

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
              {loading ? (
                <Table.Row>
                  <Table.Cell colSpan={6}>Loading...</Table.Cell>
                </Table.Row>
              ) : filteredTenants.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={6}>No institutions found.</Table.Cell>
                </Table.Row>
              ) : (
                filteredTenants.map((tenant) => (
                  <Table.Row key={tenant.id}>
                    <Table.Cell>{tenant.id}</Table.Cell>
                    <Table.Cell>{tenant.name}</Table.Cell>
                    <Table.Cell>{tenant.email}</Table.Cell>
                    <Table.Cell>{tenant.address}</Table.Cell>
                    <Table.Cell>
                      <Switch
                        checked={tenant.active}
                        onClick={() => handleToggleTenant(tenant.id)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <TenantDialogComponent
                        tenant={tenant}
                        updateTenant={handleUpdateTenant}
                      />
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Card>
      </Flex>
    </DashboardLayout>
  );
}
