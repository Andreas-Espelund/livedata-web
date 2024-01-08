import React, {useContext} from 'react'
import {Tab, Tabs} from "@nextui-org/react";

import BirthForm from "../components/tabs/BirthForm";
import {Container, Stack} from '../components/Layout';
import {Heading1} from "../components/Headings";
import RegisterIndividualForm from '../components/tabs/RegisterIndividualForm';
import DeactivationForm from "../components/tabs/DeactivationForm";
import NoteForm from '../components/tabs/NoteForm';
import {Warning} from "postcss";
import {WarningIcon} from "@/images/icons";
import {Context} from "@/App";





export default function RegistrationPage() {

    const { size } =useContext(Context)
    return (
        <div className="w-full lg:w-4/5 m-auto p-8">
                <Stack gap={"medium"}>
                    <Heading1>Registering</Heading1>
                    <Container padding={"none"}>
                        <Tabs
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
                    </Container>
                </Stack>
        </div>
    )
}
