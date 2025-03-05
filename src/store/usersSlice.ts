import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/user";

interface UserState {
  users: User[];
}

const initialState: UserState = {
  users: [],
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    updateUser: (
      state,
      action: PayloadAction<{
        userId: number;
        field: keyof User;
        value: any;
      }>
    ) => {
      const { userId, field, value } = action.payload;
      const user = state.users.find((u) => u.id === userId);
      if (user) {
        user[field] = value;
      }
    },
  },
});

export const { setUsers, updateUser } = usersSlice.actions;
export default usersSlice.reducer;
