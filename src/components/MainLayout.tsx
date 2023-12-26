import {Navbar} from "@nextui-org/react";
import {useLocation} from "react-router-dom";
import TopNavBar from "@/components/Navbar";

import { Outlet } from "react-router-dom";


const MainLayout = () => {

    console.log("MAIN LAYOUT")
    return (
        <>
            <p>
                top navigation
            </p>
            <Outlet/>
        </>
    )
}

export default MainLayout