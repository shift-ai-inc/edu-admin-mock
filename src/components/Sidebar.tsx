import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Users2,
  Settings,
  BarChart2,
  ClipboardList,
  ListChecks,
  Send,
  ShieldCheck,
  FileText,
  Building,
  LucideIcon,
  List, 
  LogOut,
  FileQuestion, 
} from 'lucide-react';

interface NavItem {
  id: string;
  path?: string;
  icon: LucideIcon;
  label: string;
  children?: NavItem[];
}

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems: NavItem[] = [
    { id: 'dashboard', path: '/dashboard', icon: LayoutDashboard, label: 'ダッシュボード' },
    { id: 'users', path: '/general-users', icon: Users, label: '利用者管理' },
    { id: 'groups', path: '/groups', icon: Users2, label: 'グループ管理' },
    {
      id: 'assessments',
      icon: ClipboardList,
      label: 'アセスメント管理',
      children: [
        { id: 'assessment-list', path: '/assessments', icon: ListChecks, label: 'アセスメント一覧' },
        { id: 'assessment-deliveries', path: '/assessment-deliveries', icon: Send, label: '配信管理' },
        { id: 'assessment-data-analysis', path: '/assessments/data-analysis', icon: BarChart2, label: 'データ分析' },
      ],
    },
    { 
      id: 'surveys',
      icon: FileQuestion, 
      label: 'サーベイ管理',
      children: [
        { id: 'survey-list', path: '/surveys', icon: List, label: 'サーベイ一覧' },
        { id: 'survey-deliveries', path: '/survey-deliveries', icon: Send, label: '配信管理' },
        { id: 'survey-data-analysis', path: '/surveys/data-analysis', icon: BarChart2, label: 'データ分析' }, 
      ],
    },
    { id: 'company-admins', path: '/company-admins', icon: ShieldCheck, label: '企業管理者管理' },
    { id: 'contracts', path: '/contracts', icon: FileText, label: '契約管理' },
    { id: 'company-info', path: '/company-info', icon: Building, label: '会社情報' },
    { id: 'settings', path: '/settings', icon: Settings, label: '設定' },
    { id: 'logout', path: '/login', icon: LogOut, label: 'ログアウト' },
  ];

   const isItemActive = (item: NavItem): boolean => {
     if (item.path && (location.pathname === item.path || location.pathname.startsWith(item.path + '/'))) {
       if (item.id === 'logout') {
           return location.pathname === '/login';
       }
       // For parent items with a direct path, active if current path starts with item.path
       // For child items, active if current path matches item.path or starts with item.path + '/'
       // This logic ensures that if you are on /surveys/some-id, both "サーベイ管理" and "サーベイ一覧" (if its path was /surveys) would be active.
       // However, "サーベイ一覧" path is exactly /surveys.
       if (item.children && item.path && location.pathname.startsWith(item.path)) {
          // Check if a more specific child is also active. If so, parent might not be "primarily" active.
          // For simplicity, if it has children and its path matches the start, consider it active.
          return true;
       }
       // If it's a direct link (no children or path doesn't match for parent with children)
       return location.pathname === item.path || location.pathname.startsWith(item.path + '/');
     }

     if (item.children) { // For parent items without a direct path, or if their path didn't match above
        return item.children.some(child =>
            child.path && (location.pathname === child.path || location.pathname.startsWith(child.path + '/'))
        );
     }
     return false;
   };

  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-800 flex flex-col">
        <div>
          <Link to="/" className="flex items-center ps-2.5 mb-5">
            <span className="self-center text-xl font-semibold whitespace-nowrap text-white">Edu-Company</span>
          </Link>
          <ul className="space-y-2 font-medium">
            {navItems.filter(item => item.id !== 'logout').map((item) => (
              <li key={item.id}>
                {item.children ? (
                  <>
                    <div // Parent item (clickable if it had a path, but here it's just a header for dropdown)
                      className={`flex items-center w-full p-2 text-base text-white rounded-lg transition duration-75 group ${
                        isItemActive(item) ? 'bg-gray-700' : 'hover:bg-gray-700'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 text-gray-400 transition duration-75 group-hover:text-white flex-shrink-0 ${isItemActive(item) ? 'text-white' : ''}`} />
                      <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap truncate">{item.label}</span>
                      {/* Dropdown indicator can be added here */}
                    </div>
                    <ul id={`dropdown-${item.id}`} className="py-1 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <Link
                            to={child.path!}
                            className={`flex items-center w-full p-2 text-white transition duration-75 rounded-lg pl-11 group hover:bg-gray-700 ${
                              (location.pathname === child.path! || location.pathname.startsWith(child.path! + '/')) && child.path !== '/' ? 'bg-gray-600' : ''
                            }`}
                          >
                            {child.icon && <child.icon className="w-4 h-4 mr-2 text-gray-400 group-hover:text-white flex-shrink-0" />}
                            <span className="truncate">{child.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link // Regular nav item without children
                    to={item.path!}
                    className={`flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group ${
                      isItemActive(item) ? 'bg-gray-700' : ''
                    }`}
                  >
                    <item.icon className={`w-5 h-5 text-gray-400 transition duration-75 group-hover:text-white flex-shrink-0 ${isItemActive(item) ? 'text-white' : ''}`} />
                    <span className="ms-3 flex-1 truncate">{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
        <ul className="pt-4 mt-auto space-y-2 font-medium border-t border-gray-700">
          {navItems.filter(item => item.id === 'logout').map((item) => (
             <li key={item.id}>
               <Link
                 to={item.path!}
                 className={`flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group ${
                   isItemActive(item) ? 'bg-gray-700' : ''
                 }`}
               >
                 <item.icon className={`w-5 h-5 text-gray-400 transition duration-75 group-hover:text-white flex-shrink-0 ${isItemActive(item) ? 'text-white' : ''}`} />
                 <span className="ms-3 flex-1 truncate">{item.label}</span>
               </Link>
             </li>
           ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
