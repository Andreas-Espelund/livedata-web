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
    }

    const links: Link[] = [
        {
            key: "birth",
            label: "Lamming",
            icon: PlusIcon,

        },

        {
            key: "note",
            label: "Notat",
            icon: InfoIcon,
        },
        {
            key: "medicine",
            label: "Medisinering",
            icon: HeartIcon,
        },
        {
            key: "delete",
            label: "Utmelding",
            icon: XIcon,
        },
    ]

    return (
        <Dropdown>
            <DropdownTrigger>
                {trigger}
            </DropdownTrigger>

            <DropdownMenu>
                {links.map((link) =>
                    <DropdownItem key={link.label}>
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