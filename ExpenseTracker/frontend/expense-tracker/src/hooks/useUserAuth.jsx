import { useContext, useEffect } from "react"
import { UserContext } from "../context/UserContext"
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const useUserAuth = () => {
  const { user, updateUser, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) return;

    let isMounted = true;

    const fecthUserInfo = async () => {

      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);

        if (isMounted && response.data) {
          updateUser(response.data);
        }
      } catch (error) {
        console.error("Error al encontrar la información del usuario:", error);
        if (isMounted) {
          clearUser();
          navigate("/login");
        }
      }
    };


    fecthUserInfo();

    return () => {
      isMounted = false;
    };
  }, [updateUser, clearUser, navigate]);
};
