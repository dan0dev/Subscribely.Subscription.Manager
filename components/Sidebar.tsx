"use client";

import { CreditCard, HelpCircle, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  disabled?: boolean;
}

const SidebarItem: FC<SidebarItemProps> = ({
  icon,
  label,
  href,
  isActive = false,
  disabled = false,
}) => {
  if (disabled) {
    return (
      <div
        className={`flex items-center gap-3 p-3 rounded-lg cursor-not-allowed opacity-60 text-light-400`}
      >
        {icon}
        <span className="font-medium">{label}</span>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
        isActive
          ? "bg-primary-100/20 text-primary-100"
          : "text-light-400 hover:bg-dark-300 hover:text-light-100"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

interface SidebarProps {
  activePage?: string;
}

const Sidebar: FC<SidebarProps> = ({ activePage = "subscriptions" }) => {
  return (
    <div className="h-full w-64 bg-dark-400 border-r border-light-600/20 flex flex-col">
      {/* Logo and Brand */}
      <div className="p-6 border-b border-light-600/20">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="logo" height={28} width={28} />
          <h1 className="text-lg font-semibold text-white">SubTrackr</h1>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-4 flex flex-col gap-2">
        <SidebarItem
          icon={<CreditCard size={20} />}
          label="Subscriptions"
          href="/"
          isActive={activePage === "subscriptions"}
        />
        <SidebarItem
          icon={<Settings size={20} />}
          label="Settings"
          href="/settings"
          isActive={activePage === "settings"}
          disabled={true}
        />
      </div>

      {/* Help Section */}
      <div className="mt-auto p-4 border-t border-light-600/20">
        <SidebarItem
          icon={<HelpCircle size={20} />}
          label="Help & Support"
          href="/help"
          disabled={true}
        />
      </div>
    </div>
  );
};

export default Sidebar;
