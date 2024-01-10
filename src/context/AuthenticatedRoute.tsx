import {Navigate} from "react-router-dom";
import {ReactNode} from "react";
import TopNavBar from "@/components/Navbar";
import {useAppContext} from "@/context/AppContext";


interface AuthenticatedRouteProps{
    children: ReactNode
}
const AuthenticatedRoute = ({ children }: AuthenticatedRouteProps) => {
    const {user}  = useAppContext()

    if (user === undefined) {
        console.log("user is ", user, "navigating to login")
        return <Navigate to="/login" />;
    }

    // User is authenticated, render the requested route
    return (
        <div>
            <TopNavBar/>
            {children}
        </div>
    )
};

export const protectRoute = (children: ReactNode) => <AuthenticatedRoute>{children}</AuthenticatedRoute>
export default AuthenticatedRoute