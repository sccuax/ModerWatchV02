import {removeAuthToken} from '../helper/authHelpers'
import { useNavigate  } from "react-router-dom";

export const useLogOut = () =>{
        const navigate = useNavigate();

        const handleLogout = () =>{
            removeAuthToken();
            navigate("/login");
        };

        return { handleLogout };
};
