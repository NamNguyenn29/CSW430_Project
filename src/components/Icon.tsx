import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import {
  Home,
  DoorClosed,
  Receipt,
  User,
  Settings,
  Bell,
  Zap,
  Droplet,
  AlertTriangle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Plus,
  Check,
  Pencil,
  Info,
  Globe,
  Moon,
  Sun,
  Trash2,
  Search,
  Lock,
  Mail,
  Users,
  RefreshCw,
  Phone,
  LogOut,
  Inbox,
  Clock,
  HelpCircle,
  Wrench,
  FileText,
  Building,
  DollarSign,
  Shield,
} from 'lucide-react-native';

export type IconName =
  | 'home'
  | 'room'
  | 'invoice'
  | 'profile'
  | 'settings'
  | 'bell'
  | 'zap'
  | 'droplet'
  | 'alert'
  | 'calendar'
  | 'back'
  | 'chevron-right'
  | 'arrow-left'
  | 'plus'
  | 'check'
  | 'edit'
  | 'info'
  | 'globe'
  | 'moon'
  | 'sun'
  | 'trash'
  | 'search'
  | 'lock'
  | 'mail'
  | 'users'
  | 'switch'
  | 'phone'
  | 'logout'
  | 'inbox'
  | 'clock'
  | 'help'
  | 'wrench'
  | 'file'
  | 'building'
  | 'dollar'
  | 'shield';

interface IconProps {
  name: IconName;
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const Icon: React.FC<IconProps> = ({
  name,
  color = '#64748B',
  size = 24,
  style,
}) => {
  const iconProps = { color, size, style };

  switch (name) {
    case 'home':
      return <Home {...iconProps} />;
    case 'room':
      return <DoorClosed {...iconProps} />;
    case 'invoice':
      return <Receipt {...iconProps} />;
    case 'profile':
      return <User {...iconProps} />;
    case 'settings':
      return <Settings {...iconProps} />;
    case 'bell':
      return <Bell {...iconProps} />;
    case 'zap':
      return <Zap {...iconProps} />;
    case 'droplet':
      return <Droplet {...iconProps} />;
    case 'alert':
      return <AlertTriangle {...iconProps} />;
    case 'calendar':
      return <Calendar {...iconProps} />;
    case 'back':
      return <ChevronLeft {...iconProps} />;
    case 'chevron-right':
      return <ChevronRight {...iconProps} />;
    case 'arrow-left':
      return <ArrowLeft {...iconProps} />;
    case 'plus':
      return <Plus {...iconProps} />;
    case 'check':
      return <Check {...iconProps} />;
    case 'edit':
      return <Pencil {...iconProps} />;
    case 'info':
      return <Info {...iconProps} />;
    case 'globe':
      return <Globe {...iconProps} />;
    case 'moon':
      return <Moon {...iconProps} />;
    case 'sun':
      return <Sun {...iconProps} />;
    case 'trash':
      return <Trash2 {...iconProps} />;
    case 'search':
      return <Search {...iconProps} />;
    case 'lock':
      return <Lock {...iconProps} />;
    case 'mail':
      return <Mail {...iconProps} />;
    case 'users':
      return <Users {...iconProps} />;
    case 'switch':
      return <RefreshCw {...iconProps} />;
    case 'phone':
      return <Phone {...iconProps} />;
    case 'logout':
      return <LogOut {...iconProps} />;
    case 'inbox':
      return <Inbox {...iconProps} />;
    case 'clock':
      return <Clock {...iconProps} />;
    case 'help':
      return <HelpCircle {...iconProps} />;
    case 'wrench':
      return <Wrench {...iconProps} />;
    case 'file':
      return <FileText {...iconProps} />;
    case 'building':
      return <Building {...iconProps} />;
    case 'dollar':
      return <DollarSign {...iconProps} />;
    case 'shield':
      return <Shield {...iconProps} />;
    default:
      return null;
  }
};
