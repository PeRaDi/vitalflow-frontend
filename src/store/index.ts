import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./authSlice";
import consumptionChartReducer from "./consumptionChartSlice";
import invitedUsersReducer from "./invitedUsersSlice";
import itemsReducer from "./itemsSlice";
import stockedItemsReducer from "./stockedItemsSlice";
import tenantsReducer from "./tenantsSlice";
import usersReducer from "./usersSlice";

const persistConfig = {
  key: "auth",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    tenants: tenantsReducer,
    users: usersReducer,
    invitedUsers: invitedUsersReducer,
    items: itemsReducer,
    stockedItems: stockedItemsReducer,
    consumptionChart: consumptionChartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
