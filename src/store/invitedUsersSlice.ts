import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InvitedUsersState {
  invitedUsers: any[];
}

const initialState: InvitedUsersState = {
  invitedUsers: [],
};

const invitedUsersSlice = createSlice({
  name: "invitedUsers",
  initialState,
  reducers: {
    setInvitedUsers: (state, action: PayloadAction<any[]>) => {
      state.invitedUsers = action.payload;
    },
    updateInvitedUsers: (
      state,
      action: PayloadAction<{
        userId: number;
        field: keyof any;
        value: any;
      }>
    ) => {
      const { userId, field, value } = action.payload;
      const user = state.invitedUsers.find((u) => u.id === userId);
      if (user) {
        user[field] = value;
      }
    },
  },
});

export const { setInvitedUsers, updateInvitedUsers } =
  invitedUsersSlice.actions;
export default invitedUsersSlice.reducer;
