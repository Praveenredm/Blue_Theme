import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  FileSearch,
  Users,
  Stethoscope,
  TrendingUp
} from "lucide-react";

const navItems = [
  { to: "/pcp", label: "Dashboard", icon: LayoutDashboard },
  { to: "/pcp/patient-entry", label: "Patient Data Entry", icon: UserPlus },
  { to: "/pcp/evaluation", label: "Referral Evaluation", icon: FileSearch },
  { to: "/pcp/matching", label: "Specialist Matching", icon: Users },
  { to: "/pcp/alternative", label: "Alternative Care", icon: Stethoscope },
  { to: "/pcp/progress", label: "Patient Progress", icon: TrendingUp }
];

export function PCPSidebar() {
  return (
    <nav className="w-full mb-6">
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border bg-card p-2 shadow-sm">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
