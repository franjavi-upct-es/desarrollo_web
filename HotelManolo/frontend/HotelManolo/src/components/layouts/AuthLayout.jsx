import { React } from "react";
import TransactionsList from "../../assets/images/TransactionsList.jsx";
import { LuTrendingUpDown } from "react-icons/lu";

const AuthLayout = ({ children }) => {
    return <div className="flex">
        <div className="w-screen">
            <h2 className="text-lg font-medium text-black">Gestor de facturas</h2>
            {children}
        </div>

        <div className="hidden md:block w-[40vw] h-screen bg-blue-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative">
            <div className="w-48 h-56 rounded-[40px] border-[20px] border-fuchsia-600 absolute top-[30%] -right-10" />
            <div className="w-48 h-56 rounded-[40px] border-violet-500 absolute -bottom-7 -left-5" />

            <div className="grid grid-cols-1 z-20">
                <StatsInfoCard
                    icon={<LuTrendingUpDown />}
                    label="Gestiona tus facturas"
                    color="bg-primary"
                />
            </div>

            <div className="w-64 lg:w-[90%] h-128 absolute bottom-10 shadow-lg shadow-blue-400/15 bg-white rounded-xl p-4">
            </div>

        </div>
    </div>;
};

export default AuthLayout;

const StatsInfoCard = ({ icon, label, value, color }) => {
    return <div className="flex gap-6 bg-white p-4 rounded-xl shadow-md shadow-purple-400/10 border border-gray-200/50 z-10">
        <div
            className={`w-12 h-12 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}
        >
            {icon}
        </div>
        <div>
            <h6 className="text-xs text-gray-500 mb-1">{label}</h6>
            <span className="text-[20px]">${value}</span>
        </div>
    </div>
}
