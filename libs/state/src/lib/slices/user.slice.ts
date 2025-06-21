import { configService } from '@tendo-app/config';
import { ApiResponse, User } from '@tendo-app/shared-dto';
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  Slice,
} from '@reduxjs/toolkit';

interface UserState {
  userEmail: string | null;
  userName: string | null;
  userRole: string | null;
  userPatientIds: string[] | null;
  userLoading: boolean;
  userImageUrl: string | null;
}

const initialState: UserState = {
  userEmail: null,
  userName: null,
  userRole: null,
  userPatientIds: null,
  userLoading: false,
  userImageUrl: null,
};

export const getUserByEmail = createAsyncThunk(
  'user/getUserByEmail',
  async (email: string, { rejectWithValue }) => {
    const apiConfig = configService.getConfig();
    const response = await fetch(`${apiConfig.baseURL}/users/${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = (await response.json()) as ApiResponse;

    if (response.ok) {
      return result.data as User | null;
    }

    console.error(
      'Error getting user by email:',
      result.message || result.error
    );
    return rejectWithValue(result.error);
  }
);

export const initializeUser = createAsyncThunk(
  'user/initializeUser',
  async (user: User, { dispatch }) => {
    if (!user.email) {
      throw new Error('User email is required');
    }

    const userByEmailResponse = await dispatch(getUserByEmail(user.email));
    const returnedUser = userByEmailResponse.payload;

    if (!returnedUser) {
      console.log('User not found. Creating a new user: ', user.email);
      dispatch(createUser(user));
    }
  }
);

export const createUser = createAsyncThunk(
  'user/createUser',
  async (user: User) => {
    const apiConfig = configService.getConfig();
    const response = await fetch(`${apiConfig.baseURL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    const result = (await response.json()) as ApiResponse;

    if (response.ok) {
      console.log('User created:', result.data);
      return result.data as User;
    }

    console.error('Error creating user:', result.message || result.error);
    return result.error;
  }
);

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
    builder.addCase(getUserByEmail.pending, (state) => {
      state.userLoading = true;
    });
    builder.addCase(getUserByEmail.fulfilled, (state, action) => {
      state.userLoading = false;
      const user = action.payload as User;

      if (!user) return;

      state.userEmail = user.email || null;
      state.userName = `${user.firstName} ${user.lastName}`;
      state.userRole = user.role || null;
      state.userPatientIds = user.patientIds || null;
      state.userImageUrl = user.imageUrl || null;
    });
  },
});

export const { setUserId, setUserLoading } = userSlice.actions;

export default userSlice.reducer;
