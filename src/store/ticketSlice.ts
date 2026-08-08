import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

interface TicketState {
  myTickets: any[];
  allTickets: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TicketState = {
  myTickets: [],
  allTickets: [],
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchMyTickets = createAsyncThunk(
  'tickets/fetchMyTickets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/users/me/tickets');
      return response.data.result?.content || response.data.result || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch tickets');
    }
  }
);

export const createTicket = createAsyncThunk(
  'tickets/createTicket',
  async (payload: { title: string; description: string; category: string }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      const jsonStr = JSON.stringify({
        title: payload.title,
        description: payload.description,
        category: payload.category,
      });
      formData.append('data', jsonStr);

      const response = await api.post('/api/users/me/tickets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch(fetchMyTickets());
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create ticket');
    }
  }
);

export const fetchAllTickets = createAsyncThunk(
  'tickets/fetchAllTickets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/tickets');
      return response.data.result?.content || response.data.result || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch all tickets');
    }
  }
);

export const updateTicketStatus = createAsyncThunk(
  'tickets/updateTicketStatus',
  async (payload: { ticketId: string; status: 'IN_PROGRESS' | 'RESOLVED'; answer: string }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.patch(`/api/tickets/${payload.ticketId}/status`, {
        status: payload.status,
        resolutionNote: payload.answer,
      });
      dispatch(fetchAllTickets());
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update ticket status');
    }
  }
);

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch My Tickets
      .addCase(fetchMyTickets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myTickets = action.payload || [];
      })
      .addCase(fetchMyTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Ticket
      .addCase(createTicket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTicket.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch All Tickets (Admin)
      .addCase(fetchAllTickets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allTickets = action.payload || [];
      })
      .addCase(fetchAllTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default ticketSlice.reducer;
