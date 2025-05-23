
import type { LucideProps } from "lucide-react";
import {
  Users,
  CreditCard,
  Share2,
  BarChart3,
  Settings,
  List,
  Users as UsersIcon, // for Manage Group
  DollarSign,
  CheckCircle,
  History,
  LogIn,
  LogOut,
  Moon,
  Sun,
  Shapes, // Generic logo icon
  LayoutDashboard,
  PieChart,
  Tags,
  Settings2,
  ListChecks,
  Home,
  Bell,
  UserCircle,
  ChevronsLeft,
  ChevronsRight,
  PanelLeft,
  MessageSquare, 
  Search, // Added for Browse Groups
} from "lucide-react";

export const Icons = {
  Users,
  Subscriptions: ListChecks,
  SharedGroups: Share2,
  Reports: PieChart,
  Settings,
  MyListings: Tags,
  ManageGroup: Settings2,
  Earnings: DollarSign,
  MyActiveSubscriptions: CheckCircle,
  PaymentHistory: History,
  Messages: MessageSquare, 
  Login: LogIn,
  Logout: LogOut,
  Moon,
  Sun,
  Logo: Shapes,
  Dashboard: LayoutDashboard,
  UserCircle,
  Bell,
  Home,
  ChevronsLeft,
  ChevronsRight,
  PanelLeft,
  BrowseGroups: Search, // Added for Browse Groups
};

export type Icon = keyof typeof Icons;
