import {Navbar} from "@nextui-org/react";
import {useLocation} from "react-router-dom";
import TopNavBar from "@/components/Navbar";

const MainLayout = ({children}) => {

    return (
        <>
            <TopNavBar/>
            {children}
        </>
    )
}

export default MainLayout