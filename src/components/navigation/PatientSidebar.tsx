import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  MessageSquare,
  Star
} from "lucide-react";

const navItems = [
  { to: "/patient", label: "Dashboard", icon: LayoutDashboard },
  { to: "/patient/referrals", label: "My Referrals", icon: FileText },
  { to: "/patient/appointments", label: "Appointments", icon: Calendar },
  { to: "/patient/chat", label: "Health Assistant", icon: MessageSquare },
  { to: "/patient/feedback", label: "Feedback", icon: Star }
];

export function PatientSidebar() {
  return (
    <nav className="w-full flex justify-center">
      <div className="flex flex-wrap gap-2 bg-card border border-border rounded-xl p-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
               ${
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
