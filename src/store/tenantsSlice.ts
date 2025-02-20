import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Tenant } from "@/types/tenant";

interface TenantState {
  tenants: Tenant[];
}

const initialState: TenantState = {
  tenants: [],
};

const tenantsSlice = createSlice({
  name: "tenants",
  initialState,
  reducers: {
    setTenants: (state, action: PayloadAction<Tenant[]>) => {
      state.tenants = action.payload;
    },
    updateTenant: (
      state,
      action: PayloadAction<{
        tenantId: number;
        field: keyof Tenant;
        value: any;
      }>
    ) => {
      const { tenantId, field, value } = action.payload;
      const tenant = state.tenants.find((t) => t.id === tenantId);
      if (tenant) {
        tenant[field] = value;
      }
    },
  },
});

export const { setTenants, updateTenant } = tenantsSlice.actions;
export default tenantsSlice.reducer;
