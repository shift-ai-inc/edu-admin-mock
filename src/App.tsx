import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Building2,
  Users,
  Settings,
  Bell,
  User,
  ClipboardList,
  FileSpreadsheet,
  BarChart4,
} from "lucide-react";
import Dashboard from "@/pages/Dashboard";
import Companies from "@/pages/Companies";
import UserManagement from "@/pages/UserManagement";
import SettingsPage from "@/pages/Settings";
import Login from "@/pages/Login";
import Contracts from "@/pages/Contracts";
import Assessments from "@/pages/Assessments";
import Surveys from "@/pages/Surveys";

const sidebarItems = [
  { icon: BarChart3, label: "ダッシュボード", path: "/" },
  { icon: Building2, label: "企業管理", path: "/companies" },
  { icon: ClipboardList, label: "契約管理", path: "/contracts" },
  { icon: FileSpreadsheet, label: "アセスメント", path: "/assessments" },
  { icon: BarChart4, label: "サーベイ", path: "/surveys" },
  { icon: Users, label: "管理者管理", path: "/users" },
  { icon: Settings, label: "設定", path: "/settings" },
];

function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // ログイン画面ではヘッダーとサイドバーを表示しない
  const isLoginPage = currentPath === "/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-white shadow fixed w-full z-10">
        <div className="flex justify-between items-center px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">
            SHIFT AI管理ポータル
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/login")}
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* サイドバー */}
      <aside className="fixed left-0 top-0 w-64 h-full bg-white shadow-lg pt-16">
        <nav className="p-4">
          {sidebarItems.map((item, index) => (
            <Button
              key={index}
              variant={currentPath === item.path ? "secondary" : "ghost"}
              className={`w-full justify-start mb-1 ${
                currentPath === item.path ? "bg-gray-100" : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </aside>

      {/* メインコンテンツ */}
      <main className="pt-16 pl-64">{children}</main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/assessments" element={<Assessments />} />
          <Route path="/surveys" element={<Surveys />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
