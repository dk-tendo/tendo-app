import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit';

interface UserState {
  userId: string | undefined;
  userLoading: boolean;
}

const initialState: UserState = {
  userId: 'test-user-id',
  userLoading: false,
};

export const userSlice: Slice<UserState> = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.userLoading = action.payload;
    },
  },
});

export const { setUserId, setUserLoading } = userSlice.actions;

export default userSlice.reducer;
