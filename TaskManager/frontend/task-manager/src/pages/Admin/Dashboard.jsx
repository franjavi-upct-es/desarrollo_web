import {useUserAuth} from "../../hooks/useUserAuth.jsx";
import {useContext} from "react";
import {UserContext} from "../../context/userContext.jsx";
import DashboardLayout from "../../components/layouts/DashboardLayout.jsx";

const Dashboard = () => {
    useUserAuth();

    const {user} = useContext(UserContext);

  return (
    <DashboardLayout>
        Dashboard
    </DashboardLayout>
  )
}

export default Dashboard
