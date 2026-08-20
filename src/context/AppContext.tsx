import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { loginUser, logoutUser, setRole, loadUserSession } from '../store/authSlice';
import { toggleTheme, setLanguage, loadUISettings } from '../store/uiSlice';
import { fetchCurrentRoom, fetchRoomTree, createBuildingNode, updateBuildingNode, deleteBuildingNode } from '../store/roomSlice';
import { fetchMyTickets, createTicket, fetchAllTickets, updateTicketStatus } from '../store/ticketSlice';
import { fetchInvoices, payInvoiceBackend } from '../store/invoiceSlice';
import { fetchStudentsAdmin, toggleUserStatus, fetchAuditLogs, fetchNotificationLogs } from '../store/adminSlice';
import { fetchAnnouncements, createAnnouncement } from '../store/announcementSlice';
import {
  Student,
  Room,
  Invoice,
  MaintenanceRequest,
  Announcement
} from '../data/mockData';
import api from '../services/api';

type Role = 'student' | 'manager';
type Theme = 'light' | 'dark';
type Language = 'vi' | 'en';

interface AppContextProps {
  // Database States
  students: Student[];
  rooms: Room[];
  invoices: Invoice[];
  requests: MaintenanceRequest[];
  announcements: Announcement[];
  auditLogs: any[];
  notificationLogs: any[];
  
  // App Config States
  currentRole: Role;
  theme: Theme;
  language: Language;
  currentUser: any;
  
  // Navigation States
  currentScreen: string;
  screenParams: any;
  navigationStack: { screen: string; params?: any }[];
  
  // Actions
  switchRole: (role: Role) => void;
  toggleTheme: () => void;
  setLanguage: (lang: Language) => void;
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
  reset: (screen: string, params?: any) => void;
  
  // Operations
  updateUserProfile: (name: string, phone: string, email: string) => void;
  addMaintenanceRequest: (title: string, description: string, category: any, priority: any) => Promise<any>;
  updateRequestStatus: (reqId: string, status: any, note: string) => void;
  payInvoice: (invoiceId: string) => void;
  addInvoice: (roomId: string, rentFee: number, electricityFee: number, waterFee: number, serviceFee: number, month: string) => Promise<{ success: boolean; message?: string }>;
  updateRoomMeter: (roomId: string, waterIndex: number, electricityIndex: number) => void;
  assignRoom: (studentId: string, roomId: string) => void;
  registerStudent: (name: string, studentId: string, email: string, phone: string, gender: any, className: string) => boolean;
  toggleUser: (userId: string) => Promise<void>;
  createNode: (payload: any) => Promise<void>;
  updateNode: (id: string, payload: any) => Promise<void>;
  deleteNode: (id: string) => Promise<void>;
  addAnnouncement: (title: string, content: string, priority: string, author: string) => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();

  // Select states from Redux
  const reduxTheme = useSelector((state: RootState) => state.ui.theme);
  const reduxLang = useSelector((state: RootState) => state.ui.language);
  const reduxRole = useSelector((state: RootState) => state.auth.currentRole);
  const reduxUser = useSelector((state: RootState) => state.auth.currentUser);
  const reduxRoom = useSelector((state: RootState) => state.room.currentRoom);
  const reduxMyTickets = useSelector((state: RootState) => state.ticket.myTickets);
  const reduxAllTickets = useSelector((state: RootState) => state.ticket.allTickets);
  const reduxRoomTree = useSelector((state: RootState) => state.room.roomTree);
  const reduxStudents = useSelector((state: RootState) => state.admin.studentsList);
  const reduxAuditLogs = useSelector((state: RootState) => state.admin.auditLogs);
  const reduxNotificationLogs = useSelector((state: RootState) => state.admin.notificationLogs);
  const reduxInvoices = useSelector((state: RootState) => state.invoice.invoices);
  const reduxAnnouncements = useSelector((state: RootState) => state.announcement.announcements);

  // Local fallback states for UI screens not fully integrated to backend tables
  // No local state fallbacks for announcements remaining

  // Robust tree extractor for Building (Level 1) -> Floor (Level 2) -> Room (Level 3)
  const extractRooms = (nodes: any[]): Room[] => {
    if (!nodes || !Array.isArray(nodes) || nodes.length === 0) return [];

    const allRooms: Room[] = [];
    const seenIds = new Set<string>();

    const getArrayFromChildren = (children: any): any[] => {
      if (!children) return [];
      if (Array.isArray(children)) return children;
      if (typeof children === 'object') return Object.values(children);
      return [];
    };

    // 1. First attempt: Parse as 3-tier Tree (Building -> Floor -> Room)
    nodes.forEach((bldgNode: any) => {
      const bldgName = bldgNode.name || '';
      const floorList = getArrayFromChildren(bldgNode.children);

      if (floorList.length > 0) {
        floorList.forEach((floorNode: any) => {
          const floorName = floorNode.name || '';
          const roomList = getArrayFromChildren(floorNode.children);

          if (roomList.length > 0) {
            roomList.forEach((roomNode: any) => {
              const rId = roomNode.id?.toString() || (bldgName && floorName && roomNode.name ? `${bldgName}-${floorName}-${roomNode.name}` : roomNode.name);
              if (rId && !seenIds.has(rId)) {
                seenIds.add(rId);
                const cap = Number(roomNode.maxCapacity) || 4;
                const occ = Number(roomNode.currentOccupancy) || 0;
                const rawPrice = Number(roomNode.price || roomNode.roomPrice || 0);
                const defaultPrice = cap > 4 ? 600000 : 1200000;
                const price = rawPrice > 0 ? rawPrice : defaultPrice;
                allRooms.push({
                  id: rId,
                  name: roomNode.name || '',
                  block: bldgName,
                  floor: floorName,
                  capacity: cap,
                  occupied: occ,
                  price,
                  status: occ >= cap && cap > 0 ? 'Đầy' : 'Còn chỗ',
                  type: roomNode.type || `${cap} giường`,
                  electricityIndex: Number(roomNode.electricityIndex || 0),
                  waterIndex: Number(roomNode.waterIndex || 0),
                  occupants: [],
                });
              }
            });
          } else {
            // In case Level 2 itself has room properties
            const isRoomLike = (floorNode.maxCapacity && Number(floorNode.maxCapacity) > 0) || /^(Phòng|Room|P\.?\s*\d|\d{3})/i.test(floorNode.name || '');
            if (isRoomLike) {
              const fId = floorNode.id?.toString() || `${bldgName}-${floorNode.name}`;
              if (!seenIds.has(fId)) {
                seenIds.add(fId);
                const cap = Number(floorNode.maxCapacity) || 4;
                const occ = Number(floorNode.currentOccupancy) || 0;
                const rawPrice = Number(floorNode.price || 0);
                const defaultPrice = cap > 4 ? 600000 : 1200000;
                const price = rawPrice > 0 ? rawPrice : defaultPrice;
                allRooms.push({
                  id: fId,
                  name: floorNode.name || '',
                  block: bldgName,
                  floor: floorName,
                  capacity: cap,
                  occupied: occ,
                  price,
                  status: occ >= cap && cap > 0 ? 'Đầy' : 'Còn chỗ',
                  type: floorNode.type || `${cap} giường`,
                  electricityIndex: Number(floorNode.electricityIndex || 0),
                  waterIndex: Number(floorNode.waterIndex || 0),
                  occupants: [],
                });
              }
            }
          }
        });
      } else {
        // Flat node or single room node
        const isRoomLike = (bldgNode.maxCapacity && Number(bldgNode.maxCapacity) > 0) || /^(Phòng|Room|P\.?\s*\d|\d{3})/i.test(bldgNode.name || '');
        if (isRoomLike) {
          const bId = bldgNode.id?.toString() || bldgNode.name;
          if (!seenIds.has(bId)) {
            seenIds.add(bId);
            const cap = Number(bldgNode.maxCapacity) || 4;
            const occ = Number(bldgNode.currentOccupancy) || 0;
            const rawPrice = Number(bldgNode.price || 0);
            const defaultPrice = cap > 4 ? 600000 : 1200000;
            const price = rawPrice > 0 ? rawPrice : defaultPrice;
            allRooms.push({
              id: bId,
              name: bldgNode.name || '',
              block: bldgNode.block || bldgName || '',
              floor: bldgNode.floor || '',
              capacity: cap,
              occupied: occ,
              price,
              status: occ >= cap && cap > 0 ? 'Đầy' : 'Còn chỗ',
              type: bldgNode.type || `${cap} giường`,
              electricityIndex: Number(bldgNode.electricityIndex || 0),
              waterIndex: Number(bldgNode.waterIndex || 0),
              occupants: [],
            });
          }
        }
      }
    });

    // 2. Fallback: If still empty (e.g. all nodes flat without children), convert all valid nodes
    if (allRooms.length === 0) {
      nodes.forEach((n: any) => {
        const id = n.id?.toString() || Math.random().toString();
        const cap = Number(n.maxCapacity) || 4;
        const occ = Number(n.currentOccupancy) || 0;
        const rawPrice = Number(n.price || 0);
        const defaultPrice = cap > 4 ? 600000 : 1200000;
        const price = rawPrice > 0 ? rawPrice : defaultPrice;
        allRooms.push({
          id,
          name: n.name || '',
          block: n.block || '',
          floor: n.floor || '',
          capacity: cap,
          occupied: occ,
          price,
          status: occ >= cap && cap > 0 ? 'Đầy' : 'Còn chỗ',
          type: n.type || `${cap} giường`,
          electricityIndex: Number(n.electricityIndex || 0),
          waterIndex: Number(n.waterIndex || 0),
          occupants: [],
        });
      });
    }

    return allRooms;
  };

  const rawRooms: Room[] = extractRooms(reduxRoomTree);
  const mappedRooms: Room[] = rawRooms.map(r => {
    // Find active students assigned to this room (by roomId or matching roomName & block)
    const roomStudents = reduxStudents.filter((s: any) => {
      if (s.status !== 'Đang ở') return false;
      if (s.roomId && r.id && s.roomId.toString().toLowerCase() === r.id.toString().toLowerCase()) return true;
      if (s.roomName && r.name && s.roomName.trim().toLowerCase() === r.name.trim().toLowerCase()) {
        if (!r.block || !s.block || r.block.trim().toLowerCase() === s.block.trim().toLowerCase()) {
          return true;
        }
      }
      return false;
    });

    const realOccupied = Math.max(roomStudents.length, r.occupied || 0);
    const occupantNames = roomStudents.map((s: any) => s.name || s.fullName);

    return {
      ...r,
      occupied: realOccupied,
      status: (realOccupied >= r.capacity && r.capacity > 0) ? 'Đầy' : r.status,
      occupants: occupantNames.length > 0 ? occupantNames : r.occupants,
    };
  });
  
  // Navigation states
  const [navigationStack, setNavigationStack] = useState<{ screen: string; params?: any }[]>([
    { screen: 'Welcome' }
  ]);
  const [currentScreen, setCurrentScreen] = useState<string>('Welcome');
  const [screenParams, setScreenParams] = useState<any>({});

  // Sync session on startup
  useEffect(() => {
    dispatch(loadUserSession());
    dispatch(loadUISettings());
  }, [dispatch]);

  // Sync data dynamically based on authentication & role
  useEffect(() => {
    if (reduxUser) {
      if (reduxRole === 'student') {
        dispatch(fetchCurrentRoom());
        dispatch(fetchRoomTree());
        dispatch(fetchStudentsAdmin());
        dispatch(fetchMyTickets());
        dispatch(fetchInvoices());
        dispatch(fetchAnnouncements());
      } else if (reduxRole === 'manager') {
        dispatch(fetchStudentsAdmin());
        dispatch(fetchRoomTree());
        dispatch(fetchAllTickets());
        dispatch(fetchInvoices());
        dispatch(fetchAuditLogs());
        dispatch(fetchNotificationLogs());
        dispatch(fetchAnnouncements());
      }
    }
  }, [reduxUser, reduxRole, dispatch]);

  const navigate = (screen: string, params?: any) => {
    // Role-based route guards (do not block when navigating from auth flow screens)
    const isAuthFlow = ['Welcome', 'Login', 'Register', 'ForgotPassword'].includes(currentScreen);
    if (!isAuthFlow) {
      if (reduxRole === 'student' && screen.startsWith('Admin')) {
        console.warn(`Access blocked: Student cannot navigate to admin screen: ${screen}`);
        return;
      }
      if (reduxRole === 'manager' && screen.startsWith('Student')) {
        console.warn(`Access blocked: Manager cannot navigate to student screen: ${screen}`);
        return;
      }
    }

    setNavigationStack(prev => [...prev, { screen, params }]);
    setCurrentScreen(screen);
    setScreenParams(params || {});
  };

  const goBack = () => {
    if (navigationStack.length <= 1) return;
    const newStack = navigationStack.slice(0, -1);
    
    // Check role before going back to the screen
    const lastScreen = newStack[newStack.length - 1];
    if (reduxRole === 'student' && lastScreen.screen.startsWith('Admin')) {
      return;
    }
    if (reduxRole === 'manager' && lastScreen.screen.startsWith('Student')) {
      return;
    }

    setNavigationStack(newStack);
    setCurrentScreen(lastScreen.screen);
    setScreenParams(lastScreen.params || {});
  };

  const reset = (screen: string, params?: any) => {
    // Role-based route guards (do not block when resetting from auth flow screens)
    const isAuthFlow = ['Welcome', 'Login', 'Register', 'ForgotPassword'].includes(currentScreen);
    if (!isAuthFlow) {
      if (reduxRole === 'student' && screen.startsWith('Admin')) {
        console.warn(`Access blocked: Student cannot reset to admin screen: ${screen}`);
        return;
      }
      if (reduxRole === 'manager' && screen.startsWith('Student')) {
        console.warn(`Access blocked: Manager cannot reset to student screen: ${screen}`);
        return;
      }
    }

    setNavigationStack([{ screen, params }]);
    setCurrentScreen(screen);
    setScreenParams(params || {});
  };

  const switchRole = (role: Role) => {
    console.warn('Manual role switching is blocked.');
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleSetLanguage = (lang: Language) => {
    dispatch(setLanguage(lang));
  };

  const updateUserProfile = async (name: string, phone: string, email: string) => {
    // API request to update profile on backend
    try {
      if (reduxUser?.id) {
        await api.put(`/api/users/${reduxUser.id}`, {
          fullName: name,
          phoneNumber: phone,
          email,
        });
        dispatch(loadUserSession());
      }
    } catch (e) {
      console.error('Failed to update profile on backend', e);
    }
  };

  const addMaintenanceRequest = async (title: string, description: string, category: any, priority: any) => {
    let apiCat = 'OTHER';
    if (category === 'Điện' || category === 'ELECTRIC') apiCat = 'MAINTENANCE';
    else if (category === 'Nước' || category === 'WATER') apiCat = 'FACILITY';
    else if (category === 'Thiết bị' || category === 'EQUIPMENT') apiCat = 'FACILITY';

    return await dispatch(createTicket({
      title,
      description,
      category: apiCat,
    })).unwrap();
  };

  const updateRequestStatusAction = async (reqId: string, status: any, note: string) => {
    let apiStatus: 'IN_PROGRESS' | 'RESOLVED' = 'IN_PROGRESS';
    if (status === 'Đã giải quyết' || status === 'RESOLVED') {
      apiStatus = 'RESOLVED';
    }
    return await dispatch(updateTicketStatus({
      ticketId: reqId,
      status: apiStatus,
      answer: note,
    })).unwrap();
  };

  const payInvoice = (invoiceId: string) => {
    dispatch(payInvoiceBackend(invoiceId));
  };

  const addInvoice = async (roomId: string, rentFee: number, electricityFee: number, waterFee: number, serviceFee: number, month: string): Promise<{ success: boolean; message?: string }> => {
    try {
      // Find room assignment for this room to link invoice correctly on backend
      const assignmentsRes = await api.get('/api/room-assignments');
      const assignments = assignmentsRes.data?.result || [];
      
      // Match room assignments for this roomId
      let matchedAssignments = assignments.filter((a: any) => {
        if (!a.roomNodeId && !a.roomNode?.id) return false;
        const assignedRoomId = (a.roomNodeId || a.roomNode?.id)?.toString().toLowerCase();
        return assignedRoomId === roomId.toString().toLowerCase();
      });

      // Fallback matching: match through local student list
      if (matchedAssignments.length === 0) {
        const targetRoom = mappedRooms.find(r => r.id === roomId);
        if (targetRoom) {
          const matchedStudents = reduxStudents.filter(s => s.roomName === targetRoom.name || s.roomId === roomId);
          if (matchedStudents.length > 0) {
            matchedAssignments = assignments.filter((a: any) => 
              matchedStudents.some(s => s.id === a.userId || s.roomAssignmentId === a.id)
            );
          }
        }
      }

      if (matchedAssignments.length === 0) {
        return {
          success: false,
          message: reduxLang === 'en'
            ? 'Cannot create invoice: No active student is assigned to this room yet. Please assign a student to this room first.'
            : 'Không thể lập hóa đơn: Phòng này hiện chưa có sinh viên nào đang lưu trú. Vui lòng xếp phòng cho sinh viên trước.'
        };
      }

      // Create invoices for students in this room
      for (const assignment of matchedAssignments) {
        const roomAssignmentId = assignment.id;

        // Create Rent Invoice
        if (rentFee > 0) {
          await api.post('/api/invoices', {
            roomAssignmentId,
            feeCategory: 'ROOM_RENT',
            amount: rentFee,
            month,
            notes: 'Tiền phòng',
          });
        }

        // Create Electricity Invoice
        if (electricityFee > 0) {
          await api.post('/api/invoices', {
            roomAssignmentId,
            feeCategory: 'ELECTRICITY',
            amount: electricityFee,
            month,
            notes: 'Tiền điện',
          });
        }

        // Create Water Invoice
        if (waterFee > 0) {
          await api.post('/api/invoices', {
            roomAssignmentId,
            feeCategory: 'WATER',
            amount: waterFee,
            month,
            notes: 'Tiền nước',
          });
        }

        // Create Service Invoice
        if (serviceFee > 0) {
          await api.post('/api/invoices', {
            roomAssignmentId,
            feeCategory: 'SERVICE',
            amount: serviceFee,
            month,
            notes: 'Phí dịch vụ',
          });
        }
      }

      // Immediately refresh invoices & audit logs
      dispatch(fetchInvoices());
      dispatch(fetchAuditLogs());
      return { success: true };
    } catch (e: any) {
      console.warn('Failed to add invoice to backend', e);
      const errMsg = e.response?.data?.message || e.message || 'Lỗi khi lập hóa đơn';
      return { success: false, message: errMsg };
    }
  };

  const updateRoomMeter = (roomId: string, waterIndex: number, electricityIndex: number) => {
    //
  };

  const assignRoom = async (studentId: string, roomId: string) => {
    try {
      if (!roomId) {
        const studentObj = reduxStudents.find((s: any) => s.id === studentId);
        if (studentObj && studentObj.roomAssignmentId) {
          await api.delete(`/api/room-assignments/${studentObj.roomAssignmentId}`);
        }
      } else {
        const start = new Date();
        const end = new Date();
        end.setFullYear(start.getFullYear() + 1);

        await api.post('/api/room-assignments/assign-manual', {
          userId: studentId,
          roomNodeId: roomId,
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          assignedBy: 'admin',
          notes: 'Xếp phòng thủ công',
        });
      }
      dispatch(fetchStudentsAdmin());
      dispatch(fetchRoomTree());
    } catch (e) {
      console.warn('Failed to assign/remove room', e);
    }
  };

  const toggleUser = async (userId: string) => {
    await dispatch(toggleUserStatus(userId)).unwrap();
  };

  const createNode = async (payload: any) => {
    await dispatch(createBuildingNode(payload)).unwrap();
  };

  const updateNode = async (id: string, payload: any) => {
    await dispatch(updateBuildingNode({ id, payload })).unwrap();
  };

  const deleteNode = async (id: string) => {
    await dispatch(deleteBuildingNode(id)).unwrap();
  };

  const addAnnouncement = async (title: string, content: string, priority: string, author: string) => {
    await dispatch(createAnnouncement({ title, content, priority, author })).unwrap();
  };

  const registerStudent = (name: string, studentId: string, email: string, phone: string, gender: any, className: string) => {
    const exists = reduxStudents.some((s: any) => s.studentId === studentId);
    if (exists) return false;
    console.warn("Register student must be done via student signup flow");
    return true;
  };

  // Format maintenance requests from backend ticket structure to matching UI object model
  const rawTickets = (reduxRole === 'student' ? reduxMyTickets : reduxAllTickets) || [];
  const ticketsArray = Array.isArray(rawTickets) ? rawTickets : (rawTickets as any).content || [];
  const formattedRequests: MaintenanceRequest[] = ticketsArray.map((ticket: any) => {
    let categoryText: 'Điện' | 'Nước' | 'Thiết bị' | 'Khác' = 'Khác';
    if (ticket.category === 'MAINTENANCE') categoryText = 'Điện';
    else if (ticket.category === 'FACILITY') categoryText = 'Thiết bị';

    let statusText: 'Chờ xử lý' | 'Đang xử lý' | 'Đã giải quyết' = 'Chờ xử lý';
    if (ticket.status === 'IN_PROGRESS') statusText = 'Đang xử lý';
    else if (ticket.status === 'RESOLVED') statusText = 'Đã giải quyết';

    const ticketRoomId = ticket.buildingNodeId || reduxRoom?.roomNodeId;
    const ticketRoom = ticketRoomId ? mappedRooms.find(r => r.id === ticketRoomId.toString()) : null;

    const logs = [
      {
        status: 'Chờ xử lý',
        date: ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('vi-VN') : 'Gần đây',
        note: 'Sự cố đã được gửi lên hệ thống.',
      }
    ];
    if (ticket.status === 'IN_PROGRESS' || ticket.status === 'RESOLVED') {
      logs.push({
        status: 'Đang xử lý',
        date: 'Gần đây',
        note: 'Đang tiến hành xử lý.',
      });
    }
    if (ticket.status === 'RESOLVED') {
      logs.push({
        status: 'Đã giải quyết',
        date: ticket.resolvedAt ? new Date(ticket.resolvedAt).toLocaleDateString('vi-VN') : 'Gần đây',
        note: ticket.resolutionNote || 'Sự cố đã được giải quyết.',
      });
    }

    return {
      id: ticket.id?.toString() || `t-${Date.now()}`,
      roomId: ticketRoomId?.toString() || '',
      roomName: ticketRoom?.name || '',
      block: ticketRoom?.block || '',
      title: ticket.title || '',
      description: ticket.description || '',
      category: categoryText,
      priority: ticket.priority || 'Bình thường',
      status: statusText,
      createdAt: ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('vi-VN') : '',
      answer: ticket.resolutionNote || ticket.answer || '',
      reporter: reduxUser?.fullName || '',
      logs,
    };
  });

  // Map backend current room details to student home display room information
  const studentRoom = reduxRoom?.roomNodeId ? mappedRooms.find(r => r.id === reduxRoom.roomNodeId.toString()) : null;

  const mappedUser = reduxUser ? {
    id: reduxUser.id,
    name: reduxUser.fullName || '',
    email: reduxUser.email || '',
    phone: reduxUser.phoneNumber || '',
    studentId: reduxUser.username || reduxUser.studentCode || '',
    gender: reduxUser.gender || '',
    class: reduxUser.major || reduxUser.className || '',
    roomId: reduxRoom?.roomNodeId?.toString() || '',
    roomName: studentRoom?.name || '',
    block: studentRoom?.block || '',
    status: reduxUser.isActive ? 'Đang ở' : 'Chờ duyệt',
    violations: [],
  } : null;

  return (
    <AppContext.Provider
      value={{
        students: reduxStudents,
        rooms: mappedRooms,
        invoices: reduxInvoices,
        requests: formattedRequests,
        announcements: reduxAnnouncements,
        auditLogs: reduxAuditLogs,
        notificationLogs: reduxNotificationLogs,
        currentRole: reduxRole,
        theme: reduxTheme,
        language: reduxLang,
        currentUser: mappedUser,
        currentScreen,
        screenParams,
        navigationStack,
        switchRole,
        toggleTheme: handleToggleTheme,
        setLanguage: handleSetLanguage,
        navigate,
        goBack,
        reset,
        updateUserProfile,
        addMaintenanceRequest,
        updateRequestStatus: updateRequestStatusAction,
        payInvoice,
        addInvoice,
        updateRoomMeter,
        assignRoom,
        registerStudent,
        toggleUser,
        createNode,
        updateNode,
        deleteNode,
        addAnnouncement,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
