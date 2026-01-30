import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  MessageSquare,
  HeartPulse,
  Star
} from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/patient/dashboard", icon: LayoutDashboard },
  { label: "Referrals", path: "/patient/referrals", icon: FileText },
  { label: "Appointments", path: "/patient/appointments", icon: Calendar },
 // { label: "Assistant", path: "/patient/chat", icon: MessageSquare },
  { label: "Care", path: "/patient/care", icon: HeartPulse },
  { label: "Feedback", path: "/patient/feedback", icon: Star },
];

export function PatientTopNav() {
  return (
    <div className="w-full flex justify-center">
      <div className="flex gap-3 bg-card p-2 rounded-xl border shadow-sm">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-sm transition
               ${
                 isActive
                   ? "bg-primary text-primary-foreground"
                   : "text-muted-foreground hover:bg-muted"
               }`
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
