import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';
import authReducer from './authSlice';
import roomReducer from './roomSlice';
import ticketReducer from './ticketSlice';
import invoiceReducer from './invoiceSlice';
import adminReducer from './adminSlice';
import announcementReducer from './announcementSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    room: roomReducer,
    ticket: ticketReducer,
    invoice: invoiceReducer,
    admin: adminReducer,
    announcement: announcementReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
