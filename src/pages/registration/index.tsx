
import {Tab, Tabs} from "@nextui-org/react";
import BirthForm from "@/pages/registration/tabs/BirthForm";
import {Heading1} from "@/components";
import RegisterIndividualForm from '@/pages/registration/tabs/RegisterIndividualForm';
import DeactivationForm from "@/pages/registration/tabs/DeactivationForm";
import NoteForm from '@/pages/registration/tabs/NoteForm';
import {useAppContext} from "@/context/AppContext";


export const RegistrationPage = () => {

    const { size } = useAppContext()
    return (
        <div className="w-full lg:w-4/5 m-auto p-2 sm:p-8 grid gap-4">

            <Heading1>Registering</Heading1>

            <Tabs
                fullWidth={size === "sm"}
                size={size}
                defaultSelectedKey={localStorage.getItem("selected_tab") || undefined}
                onSelectionChange={(key) => localStorage.setItem("selected_tab", key.toString())}
            >
                <Tab
                    id={"create"}
                    title={<p>Innmeding</p>}
                >
                    <RegisterIndividualForm/>
                </Tab>
                <Tab
                    id={"birth"}
                    title={<p>Lamming </p>}
                >
                    <BirthForm/>
                </Tab>
                <Tab
                    id={"delete"}
                    title={"Utmelding"}
                >
                    <DeactivationForm/>
                </Tab>
                <Tab
                    id={"note"}
                    title={<p>Notat</p>}
                >
                    <NoteForm/>
                </Tab>
            </Tabs>


        </div>
    )
}
