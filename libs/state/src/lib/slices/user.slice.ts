import apiService from '@tendo-app/shared-services';
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  Slice,
} from '@reduxjs/toolkit';

interface UserState {
  userId: string | undefined;
  userLoading: boolean;
}

const initialState: UserState = {
  userId: 'test-user-id',
  userLoading: false,
};

// export const getUserByEmail = createAsyncThunk(
//   'user/getUserByEmail',
//   async (email: string) => {
//     const user = await apiService.users.getUserByEmail(email);
//     return user;
//   }
// );

export const getAllUsers = createAsyncThunk(
  'user/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      // const users = await apiService.users.getUsers();
      // return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      return rejectWithValue(error);
    }
  }
);

export const userSlice: Slice<UserState> = createSlice({
  name: 'user',
  initialState,
  reducers: {},
});

export const { setUserId, setUserLoading } = userSlice.actions;

export default userSlice.reducer;
