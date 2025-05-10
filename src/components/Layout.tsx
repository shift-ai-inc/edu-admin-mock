import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom'; // Link is no longer used
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Menu,
  ChevronDown,
  ChevronRight,
  // LogOut icon is no longer needed as the sidebar logout button is removed
} from 'lucide-react';
import { cn } from '@/lib/utils';
// Tooltip components are no longer needed as the sidebar logout button is removed

interface NavItemProp {
  to: string;
  label: string;
  icon: React.ElementType;
  children?: NavItemProp[];
}

interface LayoutProps {
  navItems: NavItemProp[];
}

function Layout({ navItems }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [openDropdown, setOpenDropdown] = useState<string[]>(() =>
    navItems
      .filter((item) => item.children && item.to && currentPath.startsWith(item.to))
      .map((item) => item.to)
  );
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const isActive = (path: string, isParent: boolean = false): boolean => {
    if (path === '/' && currentPath === '/') return true;
    if (path === '/') return false;
    
    if (isParent) {
      return currentPath.startsWith(path);
    }
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  const handleParentClick = (item: NavItemProp) => {
    if (item.children && item.to) {
      setOpenDropdown((prevOpen) =>
        prevOpen.includes(item.to)
          ? prevOpen.filter((path) => path !== item.to)
          : [...prevOpen, item.to]
      );
    } else if (item.to) {
      navigate(item.to);
      if (isMobileSidebarOpen) setIsMobileSidebarOpen(false);
    }
  };

  const handleSubItemClick = (path: string) => {
    navigate(path);
    if (isMobileSidebarOpen) setIsMobileSidebarOpen(false);
  };
  
  const handleMenuItemClick = (path: string) => {
    navigate(path);
    if (isMobileSidebarOpen) setIsMobileSidebarOpen(false);
  };

  const isTakingAssessmentOrSurvey = currentPath.startsWith("/assessments/take/") || currentPath.startsWith("/surveys/take/");
  // showSidebar now only depends on isTakingAssessmentOrSurvey, as isAuthenticated is effectively always true
  const showSidebar = !isTakingAssessmentOrSurvey; 

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white text-gray-700">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">
          SHIFT AI管理ポータル
        </h1>
      </div>
      <nav className="flex-grow p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <div key={item.to}>
            <Button
              variant={isActive(item.to, !!item.children) && (item.children ? openDropdown.includes(item.to) : true) ? 'secondary' : 'ghost'}
              className="w-full justify-start py-2.5 px-3"
              onClick={() => item.children ? handleParentClick(item) : handleMenuItemClick(item.to)}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
              {item.children && (
                <span className="ml-auto">
                  {openDropdown.includes(item.to) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </span>
              )}
            </Button>
            {item.children && openDropdown.includes(item.to) && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-4 py-1">
                {item.children.map((child) => (
                  <Button
                    key={child.to}
                    variant={isActive(child.to) ? 'secondary' : 'ghost'}
                    size="sm"
                    className={`w-full justify-start text-sm py-2 px-3 ${
                      isActive(child.to) ? 'font-semibold' : ''
                    }`}
                    onClick={() => handleSubItemClick(child.to)}
                  >
                    {child.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      {/* The logout button section at the bottom of the sidebar has been removed */}
      {/* The onLogout prop is kept on LayoutProps for potential future use (e.g. header logout) */}
      {/* but is not actively used by this component anymore after removing the sidebar button. */}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {showSidebar && (
        <aside className="hidden md:flex fixed left-0 top-0 w-60 h-full bg-white shadow-lg flex-col print:hidden z-10">
          <SidebarContent />
        </aside>
      )}

      <header className={cn(
        "md:hidden fixed top-0 left-0 right-0 bg-white shadow h-16 flex items-center justify-between px-4 z-20 print:hidden",
        isTakingAssessmentOrSurvey && "hidden" 
      )}>
        <h1 className="text-lg font-semibold text-gray-900">SHIFT AI</h1>
        {showSidebar && (
          <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-white">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        )}
      </header>
      
      <main
        className={`flex-grow ${
          showSidebar ? 'md:pl-60' : 'pl-0'
        } ${isTakingAssessmentOrSurvey ? 'pt-0' : 'pt-16 md:pt-0'} print:pt-0 print:pl-0`}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
