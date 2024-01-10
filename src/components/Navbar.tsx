
import React, {useContext} from 'react'

import {
    Avatar, Card, Divider,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger, Link,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, User
} from "@nextui-org/react";


import { signOut } from 'firebase/auth';
import { auth } from "@/api/firebase";
import {Context} from "@/App";
import { useLocation, useNavigate, Link as NavLink } from 'react-router-dom';
import {
    BoltIcon,
    ClipBoardIcon,
    GearIcon,
    HomeIcon,
    InfoIcon,
    LogoutIcon,
    PersonIcon, StarIcon,
    TableIcon,
    ThreeBarsIcon
} from "@/images/icons";
import {useAppContext} from "@/context/AppContext";


const menuItems = {

    functions: [
        {
            label: "Heim",
            path: '/',
            color: "primary",
            icon: <HomeIcon/>
        },
        {
            label: "Besetning",
            path: "/individuals",
            color: "primary",
            icon: <TableIcon/>
        },
        {
            label: "Registrering",
            path: "/register",
            color: "primary",
            icon: <ClipBoardIcon/>
        },
        {
            label: "Veirar",
            path: "/breeders",
            color: "primary",
            icon: <StarIcon/>
        }
    ],
    options: [
        {
            label: "Innstillinger",
            path: "/settings",
            color: "primary",
            icon: <GearIcon/>
        },
        {
            label: "Hjelp og info",
            path: "/info",
            color: "warning",
            icon: <InfoIcon/>
        },
    ]
}
export default function TopNavBar() {

    const navigate = useNavigate()

    const { user } = useAppContext()
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const location = useLocation();


    const logout = () => {
        signOut(auth).then(() => {
            console.log('User logged out');
            // setUser(undefined); // Update the user state to reflect that the user has logged out
        }).catch((error) => {
            console.error('Logout error', error);
        });
    };

    if (location.pathname === '/signup' || location.pathname === '/login') {
        return null; // Return null to render nothing
    }

    const handleMenuItemClick = (path: string) => {
        setIsMenuOpen(false)
        navigate(path);
    };

    return (
        <Navbar isBordered className={`bg-primary text-white`} aria-label={""} maxWidth={"full"} isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>

            <NavbarMenuToggle
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                className="sm:hidden"
                icon={<ThreeBarsIcon/>}
            />
            <NavbarBrand>
                <NavLink to={"/"} className={"flex gap-4"}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                         className="w-6 h-6">
                        <path
                            d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z"/>
                    </svg>
                    <p>Livedata</p>
                </NavLink>
            </NavbarBrand>

            <NavbarContent justify={"end"} className={"hidden sm:flex"}>
                {menuItems.functions.map((item, idx) => (
                    <NavbarItem key={idx} >
                        <NavLink to={item.path}>
                            {item.label}
                        </NavLink>
                    </NavbarItem>
                ))}
                <Dropdown>
                    <DropdownTrigger>
                        <Avatar fallback={<PersonIcon/>} name={user?.userDetail?.firstname} color={"success"} className={"text-white"}/>
                    </DropdownTrigger>
                    <DropdownMenu aria-label={"user-menu"}>
                        <DropdownItem isReadOnly key="profile" className="h-14 gap-2 cursor-default" textValue={"email"}>
                            <User
                                description={"Logget inn"}
                                name={`${user?.userDetail?.firstname} ${user?.userDetail?.lastname}`}
                                avatarProps={{fallback:<PersonIcon/>, color: "success", className: "text-white"}}
                            />
                        </DropdownItem>
                        <DropdownItem onPress={() => navigate("/settings")} startContent={<GearIcon/>}> Innstillinger</DropdownItem>
                        <DropdownItem onPress={() => navigate("/info")} startContent={<InfoIcon/>}>  Hjelp og info </DropdownItem>
                        <DropdownItem startContent={<LogoutIcon/>} onPress={logout} color={"danger"} className={"text-danger"}>
                            Logg ut
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>

            <NavbarMenu aria-label={"navbar-menu"}>
                {menuItems.functions.map((item, index) =>
                <NavbarMenuItem onClick={() => handleMenuItemClick(item.path)} key={index} className={`w-full flex gap-2 items-center py-1 text-${item.color}`}>
                    {item.icon}
                    {item.label}
                </NavbarMenuItem>)}
                <Divider/>

                <NavbarMenuItem className={""}>
                    <Card className={"flex p-4 w-fit bg-opacity-20"}>
                        <User
                            description={"Logget inn"}
                            name={user?.userDetail?.firstname +" " + user?.userDetail?.lastname}
                            avatarProps={{fallback:<PersonIcon/>, color: "primary"}}
                        />
                    </Card>
                </NavbarMenuItem>
                {menuItems.options.map((item, index) =>
                    <NavbarMenuItem onClick={() => handleMenuItemClick(item.path)} key={index} className={`w-full flex gap-2 items-center py-1 text-${item.color}`}>
                        {item.icon}
                        {item.label}
                    </NavbarMenuItem>)}
                <NavbarMenuItem onClick={logout} className={"flex gap-2 items-center text-danger cursor-pointer py-1"}>
                    <LogoutIcon/>
                    Logg ut
                </NavbarMenuItem>
            </NavbarMenu>
        </Navbar>
    )
}
