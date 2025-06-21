import { configService } from '@tendo-app/config';
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
      const apiConfig = configService.getConfig();
      const response = await fetch(`${apiConfig.baseURL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        const userCount = result.data?.length || 0;
        console.log('Users:', result.data);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Get users error:', error);
    }
  }
);

export const userSlice: Slice<UserState> = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // builder.addCase(getAllUsers.fulfilled, (state, action) => {
    //   state.users = action.payload
    // });
  },
});

export const { setUserId, setUserLoading } = userSlice.actions;

export default userSlice.reducer;
