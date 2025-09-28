import {
  LuLayoutDashboard,
  LuUsers,
  LuClipboardCheck,
  LuSquarePlus,
  LuLogOut,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    id: "02",
    label: "Gestionar Tareas",
    icon: LuClipboardCheck,
    path: "/admin/tasks",
  },
  {
    id: "03",
    label: "Crear Tarea",
    icon: LuSquarePlus,
    path: "/admin/create-task",
  },
  {
    id: "04",
    label: "Miembros del Equipo",
    icon: LuUsers,
    path: "/admin/users",
  },
  {
    id: "05",
    label: "Cerrar Sesión",
    icon: LuLogOut,
    path: "logout",
  },
];

export const SIDE_MENU_USER_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/user/dashboard",
  },
  {
    id: "02",
    label: "Mis Tareas",
    icon: LuClipboardCheck,
    path: "/user/tasks",
  },
  {
    id: "05",
    label: "Cerrar Sesión",
    icon: LuLogOut,
    path: "logout",
  }
];

export const PRIORITY_DATA = [
  { label: "Baja", value: "Baja" },
  { label: "Media", value: "Media" },
  { label: "Alta", value: "Alta" },
]

export const STATUS_DATA = [
  { label: "Pendiente", value: "Pendiente" },
  { label: "En progreso", value: "En progreso" },
  { label: "Terminada", value: "Terminada" },
]
