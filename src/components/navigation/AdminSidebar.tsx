import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Award,
  BookOpen,
  Database
} from "lucide-react";
import clsx from "clsx";

const adminNavItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/performance", label: "Performance", icon: Award },
  { to: "/admin/guidelines", label: "Guidelines", icon: BookOpen },
  { to: "/admin/logs", label: "Logs", icon: Database }
];

export function AdminSidebar() {
  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-wrap gap-2 bg-card border border-border rounded-xl p-2 shadow-sm">
        {adminNavItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-muted"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
