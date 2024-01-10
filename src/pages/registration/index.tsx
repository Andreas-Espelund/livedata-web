
import {Kbd, Tab, Tabs} from "@nextui-org/react";
import BirthForm from "@/pages/registration/forms/BirthForm";
import {Heading1, InfoPopover} from "@/components";
import RegisterIndividualForm from '@/pages/registration/forms/RegisterIndividualForm';
import DeactivationForm from "@/pages/registration/forms/DeactivationForm";
import NoteForm from '@/pages/registration/forms/NoteForm';
import {useAppContext} from "@/context/AppContext";
import {MedicineForm} from "@/pages/registration/forms/MedicineForm";
import {Key, useEffect, useState} from "react";



const tabs = [
    {
        key: "create",
        label: "Innmelding",
        element: <RegisterIndividualForm/>
    },
    {
        key: "birth",
        label: "Lamming",
        element: <BirthForm/>
    },
    {
        key: "delete",
        label: "Utmelding",
        element: <DeactivationForm/>
    },
    {
        key: "note",
        label: "Notat",
        element: <NoteForm/>
    },
    {
        key: "medicine",
        label: "Medisinering",
        element: <MedicineForm/>
    },
]
export const RegistrationPage = () => {
    const { size } = useAppContext()
    const [selectedKey, setSelectedKey] = useState(localStorage.getItem("selected_tab") || tabs[0].key)


    // Update localStorage whenever selectedKey changes
    useEffect(() => {
        localStorage.setItem("selected_tab", selectedKey);
    }, [selectedKey]);

    const pressHanlder = (event) => {
        const activeElement = document.activeElement;
        const tagName = activeElement.tagName.toLowerCase();

        // If focused on form elements, ignore keypress for tab switching
        if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
            return;
        }
        // Example: Switch tabs on number keys (1-5)
        if (event.key >= '1' && event.key <= '5') {
            const idx = Number(event.key) - 1
            setSelectedKey(tabs[idx].key)
        }
    };

    useEffect(() => {
        window.addEventListener("keypress", pressHanlder)
        return () => window.removeEventListener("keypress",pressHanlder)
    }, []);
    return (
        <div className="w-full lg:w-4/5 m-auto p-2 sm:p-8 grid gap-4" id={"tab-wrapper"}>
            <div className={"flex gap-4"}>
                <Heading1>Registering</Heading1>
                <InfoPopover>
                    <p className={"font-bold"}>Snarvegar</p>
                    <div className={"flex flex-col gap-2"}>
                        {tabs.map((item, i) =>
                            <p className={"flex gap-2 items-center"}>
                                <Kbd>{i+1}</Kbd>
                                {item.label}
                            </p>
                        )}
                    </div>
                </InfoPopover>
            </div>
            <Tabs
                id={"tab-host"}
                fullWidth={size === "sm"}
                size={size}
                selectedKey={selectedKey}
                onSelectionChange={(key) => setSelectedKey(key.toString())}
            >
                {tabs.map(item =>
                    <Tab key={item.key} title={item.label}>
                        {item.element}
                    </Tab>
                )}
            </Tabs>

        </div>
    )
}
