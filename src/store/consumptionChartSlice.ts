import { getItemHistory } from "@/modules/items/transactionsService";
import { ItemConsumption } from "@/types/item-consumption";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ConsumptionChartState {
  data: ItemConsumption[];
  loading: boolean;
  error: string | null;
  currentItemId: number | null;
}

const initialState: ConsumptionChartState = {
  data: [],
  loading: false,
  error: null,
  currentItemId: null,
};

export const fetchItemConsumption = createAsyncThunk(
  "consumptionChart/fetchItemConsumption",
  async (itemId: number, { rejectWithValue, getState }) => {
    try {
      // Check if we're already loading data for the same item
      const state = getState() as { consumptionChart: ConsumptionChartState };
      if (
        state.consumptionChart.loading &&
        state.consumptionChart.currentItemId === itemId
      ) {
        return rejectWithValue("Already fetching data for this item");
      }

      const response = await getItemHistory(itemId);
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      return { itemId, data: response.data || [] };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch item history"
      );
    }
  }
);

const consumptionChartSlice = createSlice({
  name: "consumptionChart",
  initialState,
  reducers: {
    clearChartData: (state) => {
      state.data = [];
      state.error = null;
      state.currentItemId = null;
      state.loading = false;
    },
    setCurrentItemId: (state, action: PayloadAction<number>) => {
      state.currentItemId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItemConsumption.pending, (state) => {
        state.loading = true;
        state.error = null;
        // Clear data when starting a new fetch to show loading state clearly
        state.data = [];
      })
      .addCase(fetchItemConsumption.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.currentItemId = action.payload.itemId;
        state.error = null;
      })
      .addCase(fetchItemConsumption.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("Error fetching item consumption:", action.payload);
      });
  },
});

export const { clearChartData, setCurrentItemId } =
  consumptionChartSlice.actions;
export default consumptionChartSlice.reducer;
