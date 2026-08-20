import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { logoutUser } from './authSlice';

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
      const [usersRes, profilesRes, assignmentsRes, nodesRes] = await Promise.all([
        api.get('/api/users'),
        api.get('/api/users/profile/student-profiles').catch(() => ({ data: { result: [] } })),
        api.get('/api/room-assignments').catch(() => ({ data: { result: [] } })),
        api.get('/api/building-nodes').catch(() => ({ data: { result: [] } })),
      ]);

      const users = usersRes.data.result || [];
      const profiles = profilesRes.data?.result || [];
      const assignments = assignmentsRes.data?.result || [];
      const nodes = nodesRes.data?.result || [];

      // Create lookup map for building nodes to resolve room name & block
      const nodeMap = new Map<string, any>();
      nodes.forEach((n: any) => {
        if (n.id) nodeMap.set(n.id.toString(), n);
      });

      return users.map((user: any) => {
        const profile = profiles.find((p: any) => 
          (p.user && p.user.id === user.id) || p.id === user.id || (p.userId && p.userId === user.id)
        );
        const roles = user.roles || [];

        // Check if user has room assignment
        const assignment = assignments.find((a: any) => a.userId === user.id);
        let roomName = '';
        let blockName = '';
        let roomNodeId = '';

        if (assignment && assignment.roomNodeId) {
          roomNodeId = assignment.roomNodeId.toString();
          const roomNode = nodeMap.get(roomNodeId);
          if (roomNode) {
            roomName = roomNode.name;
            if (roomNode.parentId) {
              const floorNode = nodeMap.get(roomNode.parentId.toString());
              if (floorNode && floorNode.parentId) {
                const bldgNode = nodeMap.get(floorNode.parentId.toString());
                if (bldgNode) blockName = bldgNode.name;
              } else if (floorNode) {
                blockName = floorNode.name;
              }
            }
          }
        }

        // isActive mapping: if isActive === true in DB, student is active ("Đang ở"). If false, "Chờ duyệt"
        const isActive = user.isActive === true || user.active === true || user.status === 'ACTIVE' || user.status === 'ENABLE';

        return {
          id: user.id,
          name: user.fullName || user.email?.split('@')[0] || 'User',
          email: user.email,
          phone: user.phoneNumber || '',
          gender: user.gender || 'Nam',
          studentId: profile?.studentCode || '',
          class: profile?.major || '',
          status: isActive ? 'Đang ở' : 'Chờ duyệt',
          roomId: roomNodeId,
          roomName: roomName || 'Chưa xếp',
          block: blockName || 'Tòa A1',
          contractStart: assignment?.startDate ? new Date(assignment.startDate).toLocaleDateString('vi-VN') : '',
          contractEnd: assignment?.endDate ? new Date(assignment.endDate).toLocaleDateString('vi-VN') : '',
          roomAssignmentId: assignment?.id || '',
          violations: [],
          avatar: user.avatar || '',
          roles: Array.isArray(roles) ? roles.map((r: any) => typeof r === 'string' ? r : r.name) : [],
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
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.studentsList = [];
        state.auditLogs = [];
        state.notificationLogs = [];
        state.userDocuments = [];
        state.isLoading = false;
        state.error = null;
      });
  },
});

export default adminSlice.reducer;
