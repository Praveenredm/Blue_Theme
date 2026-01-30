import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileInput,
  Clock,
  Pill,
  ClipboardCheck
} from "lucide-react";

const navItems = [
  { to: "/specialist", label: "Dashboard", icon: LayoutDashboard },
  { to: "/specialist/requests", label: "Referral Requests", icon: FileInput, badge: 3 },
  { to: "/specialist/availability", label: "Availability", icon: Clock },
  { to: "/specialist/treatment", label: "Patient Treatment", icon: Pill },
  { to: "/specialist/outcomes", label: "Outcome Submission", icon: ClipboardCheck }
];

export function SpecialistSidebar() {
  return (
    <nav className="w-full mb-6">
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border bg-card p-2 shadow-sm">
        {navItems.map(({ to, label, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}

            {badge && (
              <span className="ml-1 rounded-full bg-destructive px-2 py-0.5 text-xs text-white">
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
