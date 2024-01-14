import { Tab, Tabs} from "@nextui-org/react";

import {useAppContext} from "@/context/AppContext";
import UserSettings from "@/pages/settings/tabs/UserSettings";
import {Heading1} from "@/components";
import SystemSettings from "@/pages/settings/tabs/SystemSettings";
import {DataSettings} from "@/pages/settings/tabs/DataSettings";


const tabs = [
    {
        key: "user",
        title: "Bruker",
        element: <UserSettings/>
    },
    {
        key: "system",
        title: "System",
        element: <SystemSettings/>
    },
    {
        key: "data",
        title: "Data",
        element: <DataSettings/>
    },
]

export const SettingsPage = () => {
    const {size} = useAppContext()
    return (
        <div className="w-full lg:w-4/5 m-auto p-2 sm:p-8 grid gap-4">
            <Heading1>Innstillinger</Heading1>
            <Tabs
                fullWidth = {size === "sm"}
                aria-label="Tabs form"
                defaultSelectedKey={localStorage.getItem("settings_selected_tab") || undefined}
                onSelectionChange={(key) => localStorage.setItem("settings_selected_tab", key.toString())}
                items={tabs}
            >
                {item =>
                    <Tab key={item.key} title={item.title}>
                        {item.element}
                    </Tab>
                }
            </Tabs>
        </div>
    )
}