import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

interface InvoiceState {
  invoices: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: InvoiceState = {
  invoices: [],
  isLoading: false,
  error: null,
};

export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/users/me/invoices');
      const backendInvoices = response.data.result || [];
      
      return backendInvoices.map((inv: any) => {
        let statusText = 'Chưa thanh toán';
        if (inv.status === 'PAID') statusText = 'Đã thanh toán';
        else if (inv.status === 'OVERDUE') statusText = 'Quá hạn';

        const rentFee = inv.feeCategory === 'ROOM_RENT' ? inv.amount : 0;
        const electricityFee = inv.feeCategory === 'ELECTRICITY' ? inv.amount : 0;
        const waterFee = inv.feeCategory === 'WATER' ? inv.amount : 0;
        const serviceFee = inv.feeCategory === 'SERVICE' ? inv.amount : 0;

        return {
          id: inv.id?.toString(),
          roomId: inv.roomId?.toString(),
          roomName: inv.roomName || 'Unknown',
          block: inv.blockName || 'Khu A',
          month: inv.month || '07/2026',
          rentFee,
          electricityFee,
          waterFee,
          serviceFee,
          totalFee: inv.amount,
          status: statusText,
          paymentQrCodeUrl: inv.paymentQrCodeUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=rent',
          paidAt: inv.paidAt ? new Date(inv.paidAt).toLocaleDateString('vi-VN') : null,
          notes: inv.notes,
        };
      });
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch invoices');
    }
  }
);

export const payInvoiceBackend = createAsyncThunk(
  'invoices/payInvoice',
  async (invoiceId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post(`/api/invoices/${invoiceId}/pay`);
      dispatch(fetchInvoices());
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to pay invoice');
    }
  }
);

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invoices = action.payload || [];
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default invoiceSlice.reducer;
