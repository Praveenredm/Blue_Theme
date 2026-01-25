import React from 'react';
import { SidebarNavItem } from './SidebarNavItem';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  MessageSquare,
  Heart,
  Star
} from 'lucide-react';

export function PatientSidebar() {
  return (
    <nav className="flex flex-col gap-1 p-4">
      <div className="mb-4">
        <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Navigation
        </h3>
      </div>
      <SidebarNavItem to="/patient" icon={<LayoutDashboard />} label="Dashboard" />
      <SidebarNavItem to="/patient/referrals" icon={<FileText />} label="My Referrals" />
      <SidebarNavItem to="/patient/appointments" icon={<Calendar />} label="Appointments" />
      <SidebarNavItem to="/patient/chat" icon={<MessageSquare />} label="Health Assistant" />
      <SidebarNavItem to="/patient/recommendations" icon={<Heart />} label="Care Recommendations" />
      <SidebarNavItem to="/patient/feedback" icon={<Star />} label="Feedback" />
    </nav>
  );
}
