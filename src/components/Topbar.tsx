import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Trang chủ" },
  { to: "/map-select", label: "Bản đồ" },
];

export default function Topbar() {
  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto flex items-center h-14 px-4 gap-6">
        <div className="font-bold text-lg text-green-600">BDS</div>
        <div className="flex-1 flex gap-4">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                "px-3 py-2 rounded transition " +
                (isActive
                  ? "bg-green-100 text-green-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100")
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