import React from 'react'
import {Tab, Tabs} from "@nextui-org/react";

import BirthForm from "../components/tabs/BirthForm";
import {Container, Stack} from '../components/Layout';
import {Heading1} from "../components/Headings";
import RegisterIndividualForm from '../components/tabs/RegisterIndividualForm';
import DeactivationForm from "../components/tabs/DeactivationForm";
import NoteForm from '../components/tabs/NoteForm';
import {Warning} from "postcss";
import {WarningIcon} from "@/images/icons";


export default function RegistrationPage() {
    return (
        <div className="w-full lg:w-4/5 m-auto p-8">
                <Stack gap={"medium"}>
                    <Heading1>Registering</Heading1>
                    <Container padding={"none"}>
                        <Tabs>
                            <Tab id={"create"} title={<p>Innmeding</p>}>
                                <RegisterIndividualForm/>
                            </Tab>
                            <Tab id={"birth"} title={<p className={"flex items-center gap-1 text-warning"}>Lamming <WarningIcon/></p>}>
                                <BirthForm/>
                            </Tab>
                            <Tab id={"delete"} title={<p className={"flex items-center gap-1 text-warning"}>Utmelding <WarningIcon/></p>}>
                                <DeactivationForm/>
                            </Tab>
                            <Tab id={"note"} title={<p className={"flex items-center gap-1 text-warning"}>Notat <WarningIcon/></p>}>
                                <NoteForm/>
                            </Tab>

                        </Tabs>
                    </Container>
                </Stack>
        </div>
    )
}
