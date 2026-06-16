import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  Briefcase,
  Building2,
  BarChart3,
  ClipboardCheck,
  LogOut,
  MapPin,
  MapPinned,
  Power,
  ShieldCheck,
  UserCheck,
  UserCog,
  Users,
} from "lucide-react";
import { Button } from "../components/ui/button";

export function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/dashboard/candidato", label: "Candidatos", icon: UserCheck },
    { path: "/dashboard/partido", label: "Partidos", icon: Building2 },
    { path: "/dashboard/cargo", label: "Cargos", icon: Briefcase },
    { path: "/dashboard/eleitor", label: "Eleitores", icon: Users },
    { path: "/dashboard/mesario", label: "Mesários", icon: ClipboardCheck },
    { path: "/dashboard/secao-eleitoral", label: "Seções", icon: MapPinned },
    { path: "/dashboard/zona-eleitoral", label: "Zonas", icon: MapPin },
    { path: "/dashboard/urna", label: "Urnas", icon: Power },
    { path: "/dashboard/resultados", label: "Resultados", icon: BarChart3 },
    { path: "/dashboard/usuario", label: "Usuários", icon: UserCog },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 shadow-lg flex flex-col" style={{ backgroundColor: "#66BB6A" }}>
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-white text-lg">Sistema de Votação</h2>
              <p className="text-white/80 text-xs">Painel Administrativo</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (location.pathname === "/dashboard" && item.path === "/dashboard/candidato");

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-white text-[#66BB6A] shadow-md"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/20">
          <Button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white border-none"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
