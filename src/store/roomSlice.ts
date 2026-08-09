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
      // 1. Fetch tree from Level 1 (Building -> Floor -> Room)
      const tree1Res = await api.get('/api/building-nodes/tree/1').catch(() => null);
      if (tree1Res?.data?.result && Array.isArray(tree1Res.data.result) && tree1Res.data.result.length > 0) {
        return tree1Res.data.result;
      }

      // 2. Fallback to all building nodes list if tree/1 is empty
      const listRes = await api.get('/api/building-nodes').catch(() => null);
      if (listRes?.data?.result && Array.isArray(listRes.data.result) && listRes.data.result.length > 0) {
        return listRes.data.result;
      }

      // 3. Fallback to tree/3 (Room level) or tree/4
      const tree3Res = await api.get('/api/building-nodes/tree/3').catch(() => null);
      if (tree3Res?.data?.result && Array.isArray(tree3Res.data.result) && tree3Res.data.result.length > 0) {
        return tree3Res.data.result;
      }

      const tree4Res = await api.get('/api/building-nodes/tree/4').catch(() => null);
      if (tree4Res?.data?.result && Array.isArray(tree4Res.data.result) && tree4Res.data.result.length > 0) {
        return tree4Res.data.result;
      }

      return [];
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
