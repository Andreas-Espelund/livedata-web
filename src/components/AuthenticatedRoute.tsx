import {Navigate} from "react-router-dom";
import firebase from "firebase/compat";
import { User } from "firebase/auth";
import {useContext} from "react";
import {Context} from "@/App";
import TopNavBar from "@/components/Navbar";


interface AuthenticatedRouteProps{
    user: User;
    element: React.JSX.Element;
}
const AuthenticatedRoute = ({ user, element }: AuthenticatedRouteProps) => {

    if (!user) {
        return <Navigate to="/login" />;
    }

    // User is authenticated, render the requested route
    return (
        <div>
            <TopNavBar/>
            {element}
        </div>
    )
};

export default AuthenticatedRoute