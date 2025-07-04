import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Trang chủ" },
  { to: "/map-select", label: "Bản đồ" },
];

export default function Topbar() {
  return (
    <header className="w-full bg-blue-700 shadow-md sticky top-0 z-[2000] border-b border-blue-100">
      <nav className="max-w-6xl mx-auto flex items-center h-14 px-4 gap-6">
        <div className="flex-1 flex gap-4">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                "px-3 py-2 rounded transition text-white " +
                (isActive
                  ? "bg-blue-600 font-semibold"
                  : "hover:bg-blue-600/70")
              }
              end={item.to === "/"}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
} 