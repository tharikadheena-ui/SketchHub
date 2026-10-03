import React from 'react';
import { Search, Bell, SlidersHorizontal, Menu, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TopbarProps {
  onToggleMobileSidebar?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleMobileSidebar }) => {
  return (
    <header className="h-14 bg-white border-b border-neutral-200 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Mobile hamburger & Global Search & Sync Pill */}
      <div className="flex items-center gap-3 lg:gap-4 flex-1 max-w-2xl">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-1.5 text-neutral-600 hover:text-neutral-900 rounded hover:bg-neutral-100 cursor-pointer"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-xs sm:max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            aria-label="Global search"
            placeholder="Search unavailable while backend is disconnected"
            disabled
            className="w-full bg-neutral-50 hover:bg-white text-neutral-800 placeholder:text-neutral-400 text-xs border border-neutral-200 rounded px-2.5 py-1.5 pl-8 pr-10 focus:outline-hidden focus:border-neutral-800 focus:bg-white transition-colors"
          />
        </div>

        {/* Sync Status Indicator Pill */}
        <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-neutral-200 bg-neutral-50 text-[10px] font-mono text-neutral-600 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0" />
          <span>Backend not connected</span>
        </div>
      </div>

      {/* Right: Actions, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification Bell */}
        <button
          type="button"
          disabled
          aria-label="Notifications unavailable while backend is disconnected"
          className="p-1.5 text-neutral-400 rounded-md transition-colors relative disabled:cursor-not-allowed"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* Quick Settings Icon */}
        <Link
          to="/settings"
          aria-label="Settings"
          className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
          title="System Parameters"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </Link>

        {/* Vertical Divider */}
        <div className="h-5 w-px bg-neutral-200 mx-1" />

        {/* User Profile */}
        <div className="flex items-center gap-2.5 py-1 px-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
            <UserRound className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-neutral-700 leading-tight">Account</span>
            <span className="text-[10px] font-mono text-neutral-500 leading-none mt-0.5">
              Not connected
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
