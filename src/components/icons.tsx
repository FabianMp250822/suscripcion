
import type { LucideProps } from "lucide-react";
import {
  Users,
  CreditCard,
  Share2,
  BarChart3,
  Settings,
  List,
  // Users as UsersIcon, // Duplicate, Users is already imported
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
  HandCoins, // Added for Admin Payment Transactions
  Filter, // Added for filtering
  Eye, // For view details
  Edit, // For edit actions
  ReceiptText, // Alternative for payment history/transactions
  ListFilter, // For filter button
  Gavel,      // Added for Disputes
  ShieldAlert // For security/access related alerts
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
  PaymentHistory: History, // Subscriber's own payment history
  Messages: MessageSquare,
  Login: LogIn,
  Logout: LogOut,
  Moon,
  Sun,
  Logo: Shapes, // Used for general logo, including in CreateListingDialog submitting state
  Dashboard: LayoutDashboard,
  UserCircle,
  Bell,
  Home,
  ChevronsLeft,
  ChevronsRight,
  PanelLeft,
  BrowseGroups: Search,
  AdminPaymentTransactions: HandCoins, // For admin payment management
  Filter,
  Eye,
  Edit,
  ReceiptText,
  ListFilter,
  Disputes: Gavel, // For Admin Disputes
  MyDisputes: Gavel, // For User's own disputes (can be same icon)
  AdminAccessDeniedIcon: ShieldAlert, // Icon for Admin Access Denied messages
};

export type Icon = keyof typeof Icons;
