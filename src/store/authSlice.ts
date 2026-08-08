import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { decodeJwt } from '../utils/jwt';

interface AuthState {
  accessToken: string | null;
  currentUser: any | null;
  studentProfile: any | null;
  currentRole: 'student' | 'manager';
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  currentUser: null,
  studentProfile: null,
  currentRole: 'student',
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload: any, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post('/api/v1/auth/login', payload);
      const accessToken = response.data.result.accessToken;
      await AsyncStorage.setItem('accessToken', accessToken);
      
      // Decode JWT to get user ID
      const decoded = decodeJwt(accessToken);
      if (!decoded) throw new Error('Invalid token format');

      const userId = decoded.id;
      const roles: string[] = decoded.roles || [];
      const isManager = roles.some(r => r === 'ROLE_ADMIN' || r === 'ROLE_Manager' || r === 'manager');
      const role = isManager ? 'manager' : 'student';

      // Save role
      await AsyncStorage.setItem('role', role);

      // Fetch detailed user info
      const userRes = await api.get(`/api/users/${userId}`);
      const user = userRes.data.result;

      let studentProfile = null;
      if (role === 'student') {
        try {
          const profileRes = await api.get('/api/users/profile/student-profile');
          studentProfile = profileRes.data.result;
        } catch (profileError) {
          console.warn('Failed to fetch student profile:', profileError);
        }
      }

      return { accessToken, user, role, studentProfile };
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const loginWithOAuth2 = createAsyncThunk(
  'auth/loginOAuth2',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/auth/oauth2/token');
      const accessToken = response.data.result.accessToken;
      await AsyncStorage.setItem('accessToken', accessToken);
      
      const decoded = decodeJwt(accessToken);
      if (!decoded) throw new Error('Invalid token format');

      const userId = decoded.id;
      const roles: string[] = decoded.roles || [];
      const isManager = roles.some(r => r === 'ROLE_ADMIN' || r === 'ROLE_Manager' || r === 'manager');
      const role = isManager ? 'manager' : 'student';

      await AsyncStorage.setItem('role', role);

      const userRes = await api.get(`/api/users/${userId}`);
      const user = userRes.data.result;

      let studentProfile = null;
      if (role === 'student') {
        try {
          const profileRes = await api.get('/api/users/profile/student-profile');
          studentProfile = profileRes.data.result;
        } catch (profileError) {
          console.warn('Failed to fetch student profile:', profileError);
        }
      }

      return { accessToken, user, role, studentProfile };
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'OAuth2 login failed';
      return rejectWithValue(message);
    }
  }
);

export const loginWithFirebase = createAsyncThunk(
  'auth/loginFirebase',
  async (idToken: string, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/auth/firebase', { token: idToken });
      const accessToken = response.data.result.accessToken;
      await AsyncStorage.setItem('accessToken', accessToken);
      
      const decoded = decodeJwt(accessToken);
      if (!decoded) throw new Error('Token định dạng không hợp lệ');

      const userId = decoded.id;
      const roles: string[] = decoded.roles || [];
      const isManager = roles.some(r => r === 'ROLE_ADMIN' || r === 'ROLE_Manager' || r === 'manager');
      const role = isManager ? 'manager' : 'student';

      await AsyncStorage.setItem('role', role);

      const userRes = await api.get(`/api/users/${userId}`);
      const user = userRes.data.result;

      let studentProfile = null;
      if (role === 'student') {
        try {
          const profileRes = await api.get('/api/users/profile/student-profile');
          studentProfile = profileRes.data.result;
        } catch (profileError) {
          console.warn('Failed to fetch student profile:', profileError);
        }
      }

      return { accessToken, user, role, studentProfile };
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Đăng nhập Firebase thất bại';
      return rejectWithValue(message);
    }
  }
);

export const loadUserSession = createAsyncThunk(
  'auth/loadSession',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const role = await AsyncStorage.getItem('role');
      if (!accessToken) return rejectWithValue('No token saved');

      const decoded = decodeJwt(accessToken);
      if (!decoded) throw new Error('Token is invalid');

      const userId = decoded.id;

      const userRes = await api.get(`/api/users/${userId}`);
      const user = userRes.data.result;

      let studentProfile = null;
      if (role === 'student') {
        try {
          const profileRes = await api.get('/api/users/profile/student-profile');
          studentProfile = profileRes.data.result;
        } catch (e) {
          console.warn('Profile not found');
        }
      }

      return { accessToken, user, role: (role as any) || 'student', studentProfile };
    } catch (error: any) {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('role');
      return rejectWithValue('Session expired');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/api/v1/auth/logout');
    } catch (e) {
      // Best-effort logout
    }
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('role');
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<'student' | 'manager'>) => {
      state.currentRole = action.payload;
      AsyncStorage.setItem('role', action.payload);
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.currentUser = action.payload.user;
        state.currentRole = action.payload.role as any;
        state.studentProfile = action.payload.studentProfile;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // OAuth2 Login
      .addCase(loginWithOAuth2.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithOAuth2.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.currentUser = action.payload.user;
        state.currentRole = action.payload.role as any;
        state.studentProfile = action.payload.studentProfile;
        state.isAuthenticated = true;
      })
      .addCase(loginWithOAuth2.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Firebase Login
      .addCase(loginWithFirebase.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithFirebase.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.currentUser = action.payload.user;
        state.currentRole = action.payload.role as any;
        state.studentProfile = action.payload.studentProfile;
        state.isAuthenticated = true;
      })
      .addCase(loginWithFirebase.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Load Session
      .addCase(loadUserSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUserSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.currentUser = action.payload.user;
        state.currentRole = action.payload.role as any;
        state.studentProfile = action.payload.studentProfile;
        state.isAuthenticated = true;
      })
      .addCase(loadUserSession.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.currentUser = null;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.accessToken = null;
        state.currentUser = null;
        state.studentProfile = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setRole, clearError } = authSlice.actions;
export default authSlice.reducer;
