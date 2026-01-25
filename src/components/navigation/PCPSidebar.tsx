import React from 'react';
import { SidebarNavItem } from './SidebarNavItem';
import {
  LayoutDashboard,
  UserPlus,
  FileSearch,
  Users,
  Stethoscope,
  TrendingUp
} from 'lucide-react';

export function PCPSidebar() {
  return (
    <nav className="flex flex-col gap-1 p-4">
      <div className="mb-4">
        <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Navigation
        </h3>
      </div>
      <SidebarNavItem to="/pcp" icon={<LayoutDashboard />} label="Dashboard" />
      <SidebarNavItem to="/pcp/patient-entry" icon={<UserPlus />} label="Patient Data Entry" />
      <SidebarNavItem to="/pcp/evaluation" icon={<FileSearch />} label="Referral Evaluation" />
      <SidebarNavItem to="/pcp/matching" icon={<Users />} label="Specialist Matching" />
      <SidebarNavItem to="/pcp/alternative" icon={<Stethoscope />} label="Alternative Care" />
      <SidebarNavItem to="/pcp/progress" icon={<TrendingUp />} label="Patient Progress" />
    </nav>
  );
}
