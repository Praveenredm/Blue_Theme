import React from 'react';
import { SidebarNavItem } from './SidebarNavItem';
import {
  LayoutDashboard,
  FileInput,
  Clock,
  Pill,
  ClipboardCheck
} from 'lucide-react';

export function SpecialistSidebar() {
  return (
    <nav className="flex flex-col gap-1 p-4">
      <div className="mb-4">
        <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Navigation
        </h3>
      </div>
      <SidebarNavItem to="/specialist" icon={<LayoutDashboard />} label="Dashboard" />
      <SidebarNavItem to="/specialist/requests" icon={<FileInput />} label="Referral Requests" badge={3} />
      <SidebarNavItem to="/specialist/availability" icon={<Clock />} label="Availability" />
      <SidebarNavItem to="/specialist/treatment" icon={<Pill />} label="Patient Treatment" />
      <SidebarNavItem to="/specialist/outcomes" icon={<ClipboardCheck />} label="Outcome Submission" />
    </nav>
  );
}
