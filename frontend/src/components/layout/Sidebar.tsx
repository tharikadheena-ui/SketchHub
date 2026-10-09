import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCheck,
  Award,
  BarChart2,
  Download,
  History,
  Settings,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { cn } from '../../utils/formatters';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/events', label: 'Events', icon: Calendar },
  { to: '/form-generator', label: 'Form Generator', icon: FileSpreadsheet },
  { to: '/participants', label: 'Participants', icon: Users },
  { to: '/attendance', label: 'Attendance', icon: UserCheck },
  { to: '/certificates', label: 'Certificates', icon: Award },
  { to: '/analytics', label: 'Analytics', icon: BarChart2 },
  { to: '/exports', label: 'Exports', icon: Download },
  { to: '/audit', label: 'Audit & Records', icon: History },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpenMobile = false,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-2xs"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'w-64 bg-white border-r border-neutral-200 flex flex-col justify-between shrink-0 h-screen fixed lg:sticky top-0 z-40 transition-transform duration-200 ease-in-out',
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Top: Logo & Nav */}
        <div className="flex flex-col p-4 overflow-y-auto">
          {/* Logo & Close Button (Mobile) */}
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2.5">
              {/* SketchHUB Logo Emblem */}
              <img
                src="/SketchHub_Logo.png"
                alt=""
                aria-hidden="true"
                className="w-7 h-7 shrink-0 object-contain"
              />
              <div className="flex flex-col">
                <span className="font-bold text-sm text-neutral-1400 leading-none tracking-tight">
                  SketchHUB
                </span>
              </div>
            </div>

            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-1 text-neutral-400 hover:text-neutral-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Active Event Box */}
          <div className="mt-3 mb-4 p-2.5 rounded border border-neutral-200 bg-neutral-50/70">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-neutral-400 font-semibold tracking-wider uppercase">
                ACTIVE EVENT
              </span>
              <Link
                to="/events"
                className="text-neutral-500 hover:text-neutral-900 underline cursor-pointer"
              >
                Browse
              </Link>
            </div>
            <div className="mt-1 font-mono text-xs font-semibold text-neutral-800 truncate">
              No event selected
            </div>
          </div>

          {/* Core Modules Heading */}
          <div className="text-[10px] font-mono font-semibold tracking-wider text-neutral-400 uppercase px-2 mb-1.5">
            CORE MODULES
          </div>

          {/* Navigation Links */}
          <nav aria-label="Main navigation" className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onCloseMobile}
                  className={({ isActive }) => cn(
                    'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors text-left',
                    isActive
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Status */}
        <div className="p-4 border-t border-neutral-100">
          <div className="bg-neutral-50 border border-neutral-200 rounded px-2.5 py-1.5 flex items-center justify-between text-[11px] font-mono text-neutral-600">
            <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span>Backend: offline</span>
            </div>
              <span className="text-neutral-400 font-semibold">No data</span>
          </div>
        </div>
      </aside>
    </>
  );
};
