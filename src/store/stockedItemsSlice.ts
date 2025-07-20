import { Item } from "@/types/item";
import { StockedItemOverview } from "@/types/stocked-item-overview";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StockedItemsState {
  stockedItems: StockedItemOverview[];
}

const initialState: StockedItemsState = {
  stockedItems: [],
};

const stockedItemsSlice = createSlice({
  name: "stockedItems",
  initialState,
  reducers: {
    setStockedItems: (state, action: PayloadAction<StockedItemOverview[]>) => {
      state.stockedItems = action.payload;
    },
    updateStockedItems: (
      state,
      action: PayloadAction<{
        itemId: number;
        field: keyof Item;
        value: any;
      }>
    ) => {
      const { itemId, field, value } = action.payload;
      const stockedItem = state.stockedItems.find((i) => i.itemId === itemId);
      if (stockedItem) {
        stockedItem[field] = value;
      }
    },
  },
});

export const { setStockedItems, updateStockedItems } =
  stockedItemsSlice.actions;
export default stockedItemsSlice.reducer;
