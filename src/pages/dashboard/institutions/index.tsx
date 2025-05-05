import DashboardLayout from "@/components/DashboardComponent";
import CreateTenantDialogComponent from "@/components/institutions/CreateTenantDialogComponent";
import TenantDialogComponent from "@/components/institutions/tenantDialogComponent/TenantDialogComponent";
import { getTenants, toggle, update } from "@/modules/tenants/tenantsService";
import { setTenants, updateTenant } from "@/store/tenantsSlice";
import { Tenant } from "@/types/tenant";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Card, Flex, Switch, Table, TextField } from "@radix-ui/themes";
import { CSSProperties, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

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
    const data = response.data;

    if (!response.success) {
      toast(response.message, { type: "error" });
      return;
    }

    dispatch(setTenants(data));
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

    dispatchTenantFullUpdate(response.data);
    toast(response.message, { type: "success" });
  };

  const handleToggleTenant = async (tenant: Tenant) => {
    const tenantId = tenant.id;
    const response = await toggle(tenantId);
    if (!response.success) {
      toast(response.message, { type: "error" });
      return;
    }

    dispatch(
      updateTenant({ tenantId, field: "active", value: response.data.active })
    );

    toast(
      "Successfully " +
        (response.data.active ? "activated" : "deactivated") +
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
                    <Table.Cell style={styles.cell}>{tenant.id}</Table.Cell>
                    <Table.Cell style={styles.cell}>{tenant.name}</Table.Cell>
                    <Table.Cell style={styles.cell}>{tenant.email}</Table.Cell>
                    <Table.Cell style={styles.cell}>
                      {tenant.address}
                    </Table.Cell>
                    <Table.Cell style={styles.cell}>
                      <Switch
                        checked={tenant.active}
                        onClick={() => handleToggleTenant(tenant)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <TenantDialogComponent
                        tenantId={tenant.id}
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
