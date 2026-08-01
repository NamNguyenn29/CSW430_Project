import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

interface RoomState {
  currentRoom: any | null;
  roomTree: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: RoomState = {
  currentRoom: null,
  roomTree: [],
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchCurrentRoom = createAsyncThunk(
  'room/fetchCurrentRoom',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/users/me/current-room');
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch current room');
    }
  }
);

export const fetchRoomTree = createAsyncThunk(
  'room/fetchRoomTree',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/building-nodes/tree/4');
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch room tree');
    }
  }
);

export const createBuildingNode = createAsyncThunk(
  'room/createBuildingNode',
  async (payload: any, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/api/building-nodes', payload);
      dispatch(fetchRoomTree());
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create building node');
    }
  }
);

export const updateBuildingNode = createAsyncThunk(
  'room/updateBuildingNode',
  async ({ id, payload }: { id: string; payload: any }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/api/building-nodes/${id}`, payload);
      dispatch(fetchRoomTree());
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update building node');
    }
  }
);

export const deleteBuildingNode = createAsyncThunk(
  'room/deleteBuildingNode',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/building-nodes/${id}`);
      dispatch(fetchRoomTree());
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete building node');
    }
  }
);

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentRoom.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRoom = action.payload;
      })
      .addCase(fetchCurrentRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRoomTree.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRoomTree.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roomTree = action.payload;
      })
      .addCase(fetchRoomTree.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default roomSlice.reducer;
