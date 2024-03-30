import {Individual} from "@/types/types";
import React from "react";
import {HeartIcon, InfoIcon, PlusIcon, XIcon} from "@/images/icons";
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/react";
import {NavLink} from "react-router-dom";

const QuickActions = ({ind, trigger}: { ind: Individual, trigger: React.ReactElement }) => {
    interface Link {
        key: string,
        label: string,
        icon: React.FC<React.SVGProps<SVGSVGElement>>,
        color: "danger" | "success" | "warning" | "secondary" | "default" | "primary"
    }

    const links: Link[] = [
        {
            key: "birth",
            label: "Lamming",
            icon: PlusIcon,
            color: "success"

        },

        {
            key: "note",
            label: "Notat",
            icon: InfoIcon,
            color: "warning"
        },
        {
            key: "medicine",
            label: "Medisinering",
            icon: HeartIcon,
            color: "secondary"
        },
        {
            key: "delete",
            label: "Utmelding",
            icon: XIcon,
            color: "danger"
        },
    ]

    return (
        <Dropdown>
            <DropdownTrigger>
                {trigger}
            </DropdownTrigger>

            <DropdownMenu>
                {links.map((link) =>
                    <DropdownItem color={link.color} key={link.label}>
                        <NavLink to={`/register/${ind.doc}/${link.key}`}
                                 className={`flex items-center gap-2`}>
                            <link.icon/>
                            {link.label}
                        </NavLink>
                    </DropdownItem>
                )}
            </DropdownMenu>
        </Dropdown>

    )
}

export default QuickActions;