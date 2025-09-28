import {useUserAuth} from "../../hooks/useUserAuth.jsx";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../../context/userContext.jsx";
import DashboardLayout from "../../components/layouts/DashboardLayout.jsx";
import {useNavigate} from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.js";
import {API_PATHS} from "../../utils/apiPaths.js";

const Dashboard = () => {
    useUserAuth();

    const {user} = useContext(UserContext);

    const navigate = useNavigate();
    
    const [dashboardData, setDashboardData] = useState(null);
    const [pieChartData, setPieChartData] = useState([]);
    const [barChart, setBarChart] = useState([]);
    
    const getDashboardData = async () => {
        try {
            const response = await axiosInstance.get(
                API_PATHS.TASKS.GET_DASHBOARD_DATA
            );
            if (response.data) {
                setDashboardData(response.data);
            }
        } catch (error) {
            console.error("Error cargando usuarios:", error)
        }
    };
    
    useEffect(() => {
        return () => {
            getDashboardData();
            
            return () => {};
        };
    }, []);
    
  return (
    <DashboardLayout activeMenu="Dashboard">
        Dashboard
    </DashboardLayout>
  )
}

export default Dashboard
