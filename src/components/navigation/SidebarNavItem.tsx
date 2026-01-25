import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SidebarNavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

export function SidebarNavItem({ to, icon, label, badge }: SidebarNavItemProps) {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-foreground/80 hover:bg-accent hover:text-accent-foreground"
        )
      }
    >
      <span className="h-5 w-5">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="bg-destructive text-destructive-foreground text-xs rounded-full px-2 py-0.5">
          {badge}
        </span>
      )}
    </RouterNavLink>
  );
}
