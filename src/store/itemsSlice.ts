import { Item } from "@/types/item";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ItemState {
  items: Item[];
}

const initialState: ItemState = {
  items: [],
};

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<Item[]>) => {
      state.items = action.payload;
    },
    updateItem: (
      state,
      action: PayloadAction<{
        itemId: number;
        field: keyof Item;
        value: any;
      }>
    ) => {
      const { itemId, field, value } = action.payload;
      const item = state.items.find((i) => i.id === itemId);
      if (item) {
        item[field] = value;
      }
    },
  },
});

export const { setItems, updateItem } = itemsSlice.actions;
export default itemsSlice.reducer;
