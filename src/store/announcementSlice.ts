import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

interface AnnouncementState {
  announcements: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AnnouncementState = {
  announcements: [],
  isLoading: false,
  error: null,
};

export const fetchAnnouncements = createAsyncThunk(
  'announcements/fetchAnnouncements',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/announcements');
      const data = response.data.result || [];
      return data.map((ann: any) => ({
        id: ann.id?.toString(),
        title: ann.title,
        content: ann.content,
        priority: ann.priority || 'normal',
        author: ann.author || 'Ban Quản Lý',
        date: ann.createdAt ? new Date(ann.createdAt).toLocaleDateString('vi-VN') : 'Vừa xong',
      }));
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch announcements');
    }
  }
);

export const createAnnouncement = createAsyncThunk(
  'announcements/createAnnouncement',
  async (payload: { title: string; content: string; priority: string; author: string }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/api/announcements', payload);
      dispatch(fetchAnnouncements());
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create announcement');
    }
  }
);

const announcementSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnouncements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.announcements = action.payload || [];
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default announcementSlice.reducer;
