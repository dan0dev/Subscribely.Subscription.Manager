"use client";

import Logo from "@/app/assets/logo.svg";
import { BarChart3, CreditCard, Database, HelpCircle, Settings, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { FC, useEffect, useState } from "react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  disabled?: boolean;
  isMobile?: boolean;
  onClick: () => void;
}

const SidebarItem: FC<SidebarItemProps> = ({
  icon,
  label,
  isActive = false,
  disabled = false,
  isMobile = false,
  onClick,
}) => {
  if (disabled) {
    return (
      <div
        className={`flex ${
          isMobile ? "flex-col items-center text-xs" : "items-center gap-2 sm:gap-3 md:gap-4"
        } p-2 sm:p-3 md:p-4 rounded-xl cursor-not-allowed opacity-60 text-light-400`}
      >
        {icon}
        <span className="font-medium text-xs sm:text-sm md:text-base">{label}</span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`flex ${
        isMobile ? "flex-col items-center text-xs" : "items-center gap-2 sm:gap-3 md:gap-4"
      } p-2 sm:p-3 md:p-4 rounded-xl transition-colors cursor-pointer ${
        isActive ? "bg-primary-100/20 text-primary-100" : "text-light-400 hover:bg-dark-300 hover:text-light-100"
      }`}
    >
      {icon}
      <span className="font-medium text-xs sm:text-sm md:text-base">{label}</span>
    </div>
  );
};

interface SidebarProps {
  activePage?: string;
  onTabChange?: (tab: string) => void;
}

// Create a custom admin icon component with a red dot indicator
const AdminIcon: FC<{ icon: React.ReactNode }> = ({ icon }) => {
  return (
    <div className="relative">
      {icon}
      <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500 border border-dark-400"></div>
    </div>
  );
};

const Sidebar: FC<SidebarProps> = ({ activePage = "subscriptions", onTabChange }) => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/me");
        const data = await response.json();

        if (response.ok && data.success) {
          setUserRole(data.user.role);
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
      }
    };

    fetchUserData();
  }, []);

  const isAdminOrTester = userRole === "admin" || userRole === "tester";

  const handleTabClick = (tab: string, disabled: boolean = false) => {
    if (!disabled && onTabChange) {
      onTabChange(tab);
    }
  };

  // Desktop Sidebar
  const DesktopSidebar = (
    <div className="hidden md:flex h-full w-60 lg:w-72 xl:w-80 bg-dark-400 border-r border-light-600/20 flex-col overflow-hidden">
      {/* Logo and Brand */}
      <div className="p-4 md:p-5 lg:p-7 border-b border-light-600/20 flex-shrink-0">
        <div className="flex items-center gap-3 md:gap-4">
          <Image src={Logo} alt="logo" height={30} width={30} className="h-6 w-6 md:h-8 md:w-8 lg:h-9 lg:w-9" />
          <h1 className="text-base md:text-lg lg:text-xl font-semibold text-white">Subscribely</h1>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 md:py-5 lg:py-7 px-3 md:px-4 lg:px-5 flex flex-col gap-2 md:gap-3 overflow-y-auto">
        <SidebarItem
          icon={<CreditCard size={22} className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />}
          label="My Subscriptions"
          isActive={activePage === "subscriptions"}
          onClick={() => handleTabClick("subscriptions")}
        />

        <SidebarItem
          icon={<ShoppingCart size={22} className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />}
          label="Subscription Store"
          isActive={activePage === "subscription-store"}
          onClick={() => handleTabClick("subscription-store")}
        />

        {isAdminOrTester && (
          <SidebarItem
            icon={<AdminIcon icon={<Database size={22} className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />} />}
            label="All Subscriptions"
            disabled={false}
            isActive={activePage === "all-subscriptions"}
            onClick={() => handleTabClick("all-subscriptions")}
          />
        )}

        {isAdminOrTester && (
          <SidebarItem
            icon={<AdminIcon icon={<BarChart3 size={22} className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />} />}
            label="Management"
            isActive={activePage === "management"}
            onClick={() => handleTabClick("management")}
          />
        )}

        <SidebarItem
          icon={<Settings size={22} className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />}
          label="Settings"
          isActive={activePage === "settings"}
          disabled={false}
          onClick={() => handleTabClick("settings")}
        />
      </div>

      {/* Help Section */}
      <div className="mt-auto p-3 md:p-4 lg:p-5 border-t border-light-600/20 flex-shrink-0">
        <SidebarItem
          icon={<HelpCircle size={22} className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />}
          label="Help & Support"
          disabled={true}
          onClick={() => {}}
        />
      </div>
    </div>
  );

  // Mobile Bottom Navigation
  const MobileNavigation = (
    <div className="fixed md:hidden bottom-0 left-0 right-0 bg-dark-400/95 backdrop-blur border-t border-light-600/20 rounded-t-xl shadow-lg z-50">
      <div className="flex justify-around items-center px-2 py-2">
        <SidebarItem
          icon={<CreditCard size={20} />}
          label="Subscriptions"
          isActive={activePage === "subscriptions"}
          onClick={() => handleTabClick("subscriptions")}
          isMobile
        />

        <SidebarItem
          icon={<ShoppingCart size={20} />}
          label="Store"
          isActive={activePage === "subscription-store"}
          onClick={() => handleTabClick("subscription-store")}
          isMobile
        />

        {isAdminOrTester && (
          <SidebarItem
            icon={<AdminIcon icon={<Database size={20} />} />}
            label="All"
            isActive={activePage === "all-subscriptions"}
            onClick={() => handleTabClick("all-subscriptions")}
            isMobile
          />
        )}

        {isAdminOrTester && (
          <SidebarItem
            icon={<AdminIcon icon={<BarChart3 size={20} />} />}
            label="Manage"
            isActive={activePage === "management"}
            onClick={() => handleTabClick("management")}
            isMobile
          />
        )}

        <SidebarItem
          icon={<Settings size={20} />}
          label="Settings"
          isActive={activePage === "settings"}
          onClick={() => handleTabClick("settings")}
          isMobile
        />
      </div>
    </div>
  );

  return (
    <>
      {DesktopSidebar}
      {MobileNavigation}
    </>
  );
};

export default Sidebar;
