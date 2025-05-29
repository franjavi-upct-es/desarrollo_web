import {
    LuLayoutDashboard,
    LuHandCoins,
    LuWalletMinimal,
    LuLogOut
} from 'react-icons/lu';

export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/dashboard",
    },
    {
        id: "02",
        label: "Ingresos",
        icon: LuWalletMinimal,
        path: "/income",
    },
    {
        id: "03",
        label: "Gastos",
        icon: LuHandCoins,
        path: "expense",
    },
    {
        id: "06",
        label: "Cerrar sesión",
        icon: LuLogOut,
        path: "logout"
    },
]
