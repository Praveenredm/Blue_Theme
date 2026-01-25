import React from 'react';
import { SidebarNavItem } from './SidebarNavItem';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Award,
  BookOpen,
  Database
} from 'lucide-react';

export function AdminSidebar() {
  return (
    <nav className="flex flex-col gap-1 p-4">
      <div className="mb-4">
        <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Administration
        </h3>
      </div>
      <SidebarNavItem to="/admin" icon={<LayoutDashboard />} label="Dashboard" />
      <SidebarNavItem to="/admin/users" icon={<Users />} label="User Management" />
      <SidebarNavItem to="/admin/analytics" icon={<BarChart3 />} label="Referral Analytics" />
      <SidebarNavItem to="/admin/performance" icon={<Award />} label="Specialist Performance" />
      <SidebarNavItem to="/admin/guidelines" icon={<BookOpen />} label="Model Guidelines" />
      <SidebarNavItem to="/admin/logs" icon={<Database />} label="System Logs" />
    </nav>
  );
}
