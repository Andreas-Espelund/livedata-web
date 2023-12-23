
import React, {useContext} from 'react'
import {
    Avatar,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem
} from "@nextui-org/react";

import { signOut } from 'firebase/auth';
import { auth } from "@/api/firebase";
import {Context} from "@/App"; // Update this path if necessary


const menuItems = [
    {
        label: "Individer",
        path: "/individuals"
    },
    {
        label: "Registrering",
        path: "/register"
    },
];
export default function TopNavBar() {

    const { user } = useContext(Context)


    const logout = () => {
        signOut(auth).then(() => {
            console.log('User logged out');
            // setUser(undefined); // Update the user state to reflect that the user has logged out
        }).catch((error) => {
            console.error('Logout error', error);
        });
    };

    const hidden = window.location.pathname === "/signup" || window.location.pathname === "/login"

    return (
        <Navbar isBordered className={`bg-primary text-white ${hidden ? "hidden" : ""}`} aria-label={""}>
            <NavbarBrand>
                <a href={"/"} className={"flex gap-4"}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                         className="w-6 h-6">
                        <path
                            d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z"/>
                    </svg>
                    <p>Livedata</p>
                </a>
            </NavbarBrand>

            <NavbarContent justify={"end"}>
                {menuItems.map((item, idx) => (
                    <NavbarItem key={idx}>
                        <a href={item.path}>
                            {item.label}
                        </a>
                    </NavbarItem>
                ))}
            </NavbarContent>

            <NavbarContent justify={"end"}>
                <Dropdown>
                    <DropdownTrigger>
                        <Avatar/>
                    </DropdownTrigger>
                    <DropdownMenu aria-label={"user-menu"}>
                        <DropdownItem key="profile" className="h-14 gap-2" textValue={"email"}>
                            <p className="font-semibold">Logga inn som</p>
                            <p className="font-semibold">{user?.email}</p>
                        </DropdownItem>
                        <DropdownItem> Innstillinger </DropdownItem>
                        <DropdownItem> Info / oppdateringer </DropdownItem>
                        <DropdownItem> Hjelp og kontakt </DropdownItem>
                        <DropdownItem onClick={logout} color={"danger"} className={"text-danger"}>
                            Logg ut
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
        </Navbar>
    )
}
