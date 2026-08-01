export interface Student {
  id: string;
  name: string;
  studentId: string;
  email: string;
  phone: string;
  gender: 'Nam' | 'Nữ';
  class: string;
  roomId: string;
  roomName: string;
  block: string;
  contractStart: string;
  contractEnd: string;
  avatar: string;
  status: 'Đang ở' | 'Đã chuyển đi' | 'Chờ duyệt';
  violations: string[];
}

export interface Room {
  id: string;
  name: string;
  block: string;
  type: string; // "4 giường" | "8 giường"
  price: number;
  occupied: number;
  capacity: number;
  status: 'Còn chỗ' | 'Đầy' | 'Đang sửa chữa';
  waterIndex: number;
  electricityIndex: number;
  occupants: string[]; // List of student names
}

export interface Invoice {
  id: string;
  roomId: string;
  roomName: string;
  block: string;
  month: string; // "Tháng 07/2026"
  rentFee: number;
  electricityFee: number;
  waterFee: number;
  serviceFee: number;
  totalFee: number;
  status: 'Đã thanh toán' | 'Chưa thanh toán' | 'Quá hạn';
  paidAt?: string;
  paymentQrCodeUrl: string;
}

export interface MaintenanceRequest {
  id: string;
  roomId: string;
  roomName: string;
  block: string;
  title: string;
  description: string;
  category: 'Điện' | 'Nước' | 'Thiết bị' | 'Khác';
  priority: 'Thấp' | 'Trung bình' | 'Cao';
  status: 'Chờ xử lý' | 'Đang xử lý' | 'Đã giải quyết';
  createdAt: string;
  reporter: string;
  logs: { date: string; status: string; note: string }[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'normal' | 'important';
  author: string;
}

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 's1',
    name: 'Nguyễn Văn A',
    studentId: 'B22DCCN001',
    email: 'anguyen@student.edu.vn',
    phone: '0912345678',
    gender: 'Nam',
    class: 'D22CQCN01-B',
    roomId: 'r1',
    roomName: 'P.101',
    block: 'Tòa A1',
    contractStart: '01/09/2025',
    contractEnd: '30/06/2026',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    status: 'Đang ở',
    violations: [],
  },
  {
    id: 's2',
    name: 'Trần Thị B',
    studentId: 'B22DCCN002',
    email: 'btran@student.edu.vn',
    phone: '0987654321',
    gender: 'Nữ',
    class: 'D22CQCN02-B',
    roomId: 'r4',
    roomName: 'P.201',
    block: 'Tòa B2',
    contractStart: '01/09/2025',
    contractEnd: '30/06/2026',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    status: 'Đang ở',
    violations: ['Không dọn vệ sinh phòng ngày 12/05/2026'],
  },
  {
    id: 's3',
    name: 'Lê Văn C',
    studentId: 'B22DCCN003',
    email: 'cle@student.edu.vn',
    phone: '0933445566',
    gender: 'Nam',
    class: 'D22CQMR01-B',
    roomId: 'r1',
    roomName: 'P.101',
    block: 'Tòa A1',
    contractStart: '05/09/2025',
    contractEnd: '30/06/2026',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    status: 'Đang ở',
    violations: [],
  },
  {
    id: 's4',
    name: 'Phạm Minh D',
    studentId: 'B22DCCN004',
    email: 'dpham@student.edu.vn',
    phone: '0955667788',
    gender: 'Nam',
    class: 'D22CQVT03-A',
    roomId: 'r2',
    roomName: 'P.102',
    block: 'Tòa A1',
    contractStart: '01/09/2025',
    contractEnd: '30/06/2026',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    status: 'Đang ở',
    violations: [],
  },
  {
    id: 's5',
    name: 'Hoàng Thị E',
    studentId: 'B22DCCN005',
    email: 'ehoang@student.edu.vn',
    phone: '0977889900',
    gender: 'Nữ',
    class: 'D22CQCN03-B',
    roomId: 'r4',
    roomName: 'P.201',
    block: 'Tòa B2',
    contractStart: '01/09/2025',
    contractEnd: '30/06/2026',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    status: 'Đang ở',
    violations: [],
  },
  {
    id: 's6',
    name: 'Vũ Văn F',
    studentId: 'B23DCCN012',
    email: 'fvu@student.edu.vn',
    phone: '0944556677',
    gender: 'Nam',
    class: 'D23CQCN01-A',
    roomId: '',
    roomName: 'Chưa xếp phòng',
    block: '',
    contractStart: '',
    contractEnd: '',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    status: 'Chờ duyệt',
    violations: [],
  }
];

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'r1',
    name: 'P.101',
    block: 'Tòa A1',
    type: '4 giường',
    price: 1200000,
    occupied: 2,
    capacity: 4,
    status: 'Còn chỗ',
    waterIndex: 120,
    electricityIndex: 1450,
    occupants: ['Nguyễn Văn A', 'Lê Văn C'],
  },
  {
    id: 'r2',
    name: 'P.102',
    block: 'Tòa A1',
    type: '4 giường',
    price: 1200000,
    occupied: 4,
    capacity: 4,
    status: 'Đầy',
    waterIndex: 98,
    electricityIndex: 1200,
    occupants: ['Phạm Minh D', 'Trần Văn X', 'Ngô Văn Y', 'Lý Văn Z'],
  },
  {
    id: 'r3',
    name: 'P.103',
    block: 'Tòa A1',
    type: '8 giường',
    price: 600000,
    occupied: 0,
    capacity: 8,
    status: 'Đang sửa chữa',
    waterIndex: 50,
    electricityIndex: 800,
    occupants: [],
  },
  {
    id: 'r4',
    name: 'P.201',
    block: 'Tòa B2',
    type: '4 giường',
    price: 1500000,
    occupied: 2,
    capacity: 4,
    status: 'Còn chỗ',
    waterIndex: 210,
    electricityIndex: 2340,
    occupants: ['Trần Thị B', 'Hoàng Thị E'],
  },
  {
    id: 'r5',
    name: 'P.202',
    block: 'Tòa B2',
    type: '8 giường',
    price: 750000,
    occupied: 6,
    capacity: 8,
    status: 'Còn chỗ',
    waterIndex: 180,
    electricityIndex: 3100,
    occupants: ['Nguyễn Thu H', 'Lê Thị K', 'Đỗ Thị L', 'Bùi Thị M', 'Phan Thị N', 'Trương Thị P'],
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'i1',
    roomId: 'r1',
    roomName: 'P.101',
    block: 'Tòa A1',
    month: 'Tháng 07/2026',
    rentFee: 2400000, // For 2 roommates
    electricityFee: 450000, // 150 kWh * 3000
    waterFee: 120000, // 10 m3 * 12000
    serviceFee: 100000, // Wifi + Vệ sinh
    totalFee: 3070000,
    status: 'Chưa thanh toán',
    paymentQrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=STB_DormitoryPay_r1_072026',
  },
  {
    id: 'i2',
    roomId: 'r4',
    roomName: 'P.201',
    block: 'Tòa B2',
    month: 'Tháng 07/2026',
    rentFee: 3000000,
    electricityFee: 620000,
    waterFee: 144000,
    serviceFee: 100000,
    totalFee: 3864000,
    status: 'Đã thanh toán',
    paidAt: '05/07/2026',
    paymentQrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=STB_DormitoryPay_r4_072026',
  },
  {
    id: 'i3',
    roomId: 'r2',
    roomName: 'P.102',
    block: 'Tòa A1',
    month: 'Tháng 06/2026',
    rentFee: 4800000,
    electricityFee: 850000,
    waterFee: 240000,
    serviceFee: 150000,
    totalFee: 6040000,
    status: 'Quá hạn',
    paymentQrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=STB_DormitoryPay_r2_062026',
  }
];

export const INITIAL_REQUESTS: MaintenanceRequest[] = [
  {
    id: 'req1',
    roomId: 'r1',
    roomName: 'P.101',
    block: 'Tòa A1',
    title: 'Hỏng vòi nước phòng tắm',
    description: 'Vòi nước rửa mặt trong phòng tắm bị rò rỉ nước liên tục gây lãng phí nước và ẩm ướt sàn nhà.',
    category: 'Nước',
    priority: 'Trung bình',
    status: 'Đang xử lý',
    createdAt: '08/07/2026 09:30',
    reporter: 'Nguyễn Văn A',
    logs: [
      { date: '08/07/2026 09:30', status: 'Chờ xử lý', note: 'Yêu cầu được gửi từ sinh viên.' },
      { date: '09/07/2026 14:00', status: 'Đang xử lý', note: 'Đã phân công kỹ thuật viên Trần Văn Nam đến kiểm tra.' }
    ]
  },
  {
    id: 'req2',
    roomId: 'r4',
    roomName: 'P.201',
    block: 'Tòa B2',
    title: 'Hỏng điều hòa nhiệt độ',
    description: 'Điều hòa bật lên không mát, có tiếng kêu to ở cục nóng bên ngoài.',
    category: 'Điện',
    priority: 'Cao',
    status: 'Chờ xử lý',
    createdAt: '11/07/2026 10:15',
    reporter: 'Trần Thị B',
    logs: [
      { date: '11/07/2026 10:15', status: 'Chờ xử lý', note: 'Yêu cầu mới được tạo.' }
    ]
  },
  {
    id: 'req3',
    roomId: 'r2',
    roomName: 'P.102',
    block: 'Tòa A1',
    title: 'Gãy tay nắm cửa ra vào',
    description: 'Tay nắm cửa phòng bị lỏng và gãy chốt trong, cần thay thế khóa mới.',
    category: 'Thiết bị',
    priority: 'Thấp',
    status: 'Đã giải quyết',
    createdAt: '01/07/2026 08:00',
    reporter: 'Phạm Minh D',
    logs: [
      { date: '01/07/2026 08:00', status: 'Chờ xử lý', note: 'Yêu cầu được gửi.' },
      { date: '02/07/2026 10:00', status: 'Đang xử lý', note: 'Kỹ thuật viên đang mua ổ khóa mới.' },
      { date: '02/07/2026 16:30', status: 'Đã giải quyết', note: 'Đã thay ổ khóa và tay nắm mới hoàn tất.' }
    ]
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Lịch phun thuốc diệt muỗi toàn bộ kí túc xá',
    content: 'Ban quản lý kí túc xá thông báo lịch phun thuốc muỗi phòng chống dịch sốt xuất huyết từ 8h00 đến 17h00 ngày Chủ Nhật 15/07/2026. Yêu cầu sinh viên dọn dẹp phòng gọn gàng, đóng kín các tủ đồ và ra ngoài trong thời gian phun thuốc.',
    date: '10/07/2026',
    priority: 'important',
    author: 'Ban Quản Lý KTX'
  },
  {
    id: 'a2',
    title: 'Nhắc nhở nộp tiền điện nước tháng 06/2026',
    content: 'Hiện tại đã quá hạn nộp tiền điện nước tháng 06/2026 đối với một số phòng. Đề nghị đại diện các phòng kiểm tra hóa đơn và thanh toán trước ngày 15/07/2026 để tránh bị cắt dịch vụ.',
    date: '08/07/2026',
    priority: 'normal',
    author: 'Phòng Tài Vụ'
  },
  {
    id: 'a3',
    title: 'Đăng kí tạm trú tạm vắng trực tuyến',
    content: 'Sinh viên mới nhập phòng lưu ý hoàn thành thủ tục đăng kí tạm trú thông qua ứng dụng hoặc nộp giấy tại văn phòng BQL trước ngày 20/07/2026 theo quy định pháp luật.',
    date: '05/07/2026',
    priority: 'normal',
    author: 'Công an Phường / BQL'
  }
];
