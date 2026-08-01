import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

interface AdminState {
  studentsList: any[];
  auditLogs: any[];
  notificationLogs: any[];
  userDocuments: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  studentsList: [],
  auditLogs: [],
  notificationLogs: [],
  userDocuments: [],
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchStudentsAdmin = createAsyncThunk(
  'admin/fetchStudents',
  async (_, { rejectWithValue }) => {
    try {
      const [usersRes, profilesRes, assignmentsRes, roomsTreeRes] = await Promise.all([
        api.get('/api/users'),
        api.get('/api/users/profile/student-profiles').catch(() => ({ data: { result: [] } })),
        api.get('/api/room-assignments').catch(() => ({ data: { result: [] } })),
        api.get('/api/building-nodes/tree/4').catch(() => ({ data: { result: [] } })),
      ]);

      const users = usersRes.data.result || [];
      const profiles = profilesRes.data?.result || [];
      const assignments = assignmentsRes.data?.result || [];
      const roomsTree = roomsTreeRes.data?.result || [];

      return users.map((user: any) => {
        const profile = profiles.find((p: any) => p.user?.id === user.id || p.id === user.id);
        const roles = user.roles || [];
        const isManager = roles.some((r: any) => r.name === 'Admin' || r.name === 'Manager' || r.name === 'ROLE_ADMIN' || r.name === 'ROLE_Manager');

        // Check if user has room assignment
        const assignment = assignments.find((a: any) => a.userId === user.id);
        const roomNode = assignment ? roomsTree.find((r: any) => r.id === assignment.roomNodeId) : null;

        let roomName = 'Chưa xếp';
        let blockName = '';
        if (roomNode) {
          roomName = roomNode.name;
          if (roomNode.parent?.parent) {
            blockName = roomNode.parent.parent.name;
          }
        }

        return {
          id: user.id,
          name: user.fullName,
          email: user.email,
          phone: user.phoneNumber || 'N/A',
          gender: user.gender || 'Nam',
          studentId: profile?.studentCode || (isManager ? 'BQL' : 'Chưa cập nhật'),
          class: profile?.major || (isManager ? 'Ban Quản Lý' : 'Chưa cập nhật'),
          status: user.isActive ? 'Đang ở' : 'Chờ duyệt',
          roomId: roomNode?.id || '',
          roomName,
          block: blockName,
          contractStart: assignment?.startDate ? new Date(assignment.startDate).toLocaleDateString('vi-VN') : 'N/A',
          contractEnd: assignment?.endDate ? new Date(assignment.endDate).toLocaleDateString('vi-VN') : 'N/A',
          roomAssignmentId: assignment?.id || '',
          violations: [],
          avatar: '',
          roles: roles.map((r: any) => r.name),
        };
      });
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch students list');
    }
  }
);

export const toggleUserStatus = createAsyncThunk(
  'admin/toggleUserStatus',
  async (userId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.patch(`/api/users/toggle/${userId}`);
      dispatch(fetchStudentsAdmin());
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to toggle user status');
    }
  }
);

export const fetchAuditLogs = createAsyncThunk(
  'admin/fetchAuditLogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/audit-logs');
      return response.data.result?.content || response.data.result || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch audit logs');
    }
  }
);

export const fetchNotificationLogs = createAsyncThunk(
  'admin/fetchNotificationLogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/notifications/logs');
      return response.data.content || response.data.result?.content || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch notification logs');
    }
  }
);

export const fetchUserDocuments = createAsyncThunk(
  'admin/fetchUserDocuments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/users/me/documents');
      return response.data.result || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch user documents');
    }
  }
);

export const uploadUserDocument = createAsyncThunk(
  'admin/uploadUserDocument',
  async (payload: { documentType: string; file: any }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append('documentType', payload.documentType);
      formData.append('status', 'PENDING');
      formData.append('file', payload.file);

      const response = await api.post('/api/users/me/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      dispatch(fetchUserDocuments());
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to upload document');
    }
  }
);

export const auditUserDocument = createAsyncThunk(
  'admin/auditUserDocument',
  async (payload: { documentId: string; status: 'APPROVED' | 'REJECTED'; rejectReason?: string }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/users/me/documents/${payload.documentId}/status`, {
        status: payload.status,
        rejectReason: payload.rejectReason,
      });
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to audit document');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentsAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudentsAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.studentsList = action.payload || [];
      })
      .addCase(fetchStudentsAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.auditLogs = action.payload || [];
      })
      .addCase(fetchNotificationLogs.fulfilled, (state, action) => {
        state.notificationLogs = action.payload || [];
      })
      .addCase(fetchUserDocuments.fulfilled, (state, action) => {
        state.userDocuments = action.payload || [];
      });
  },
});

export default adminSlice.reducer;
