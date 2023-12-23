import React from 'react'
import {Tab, Tabs} from "@nextui-org/react";

import BirthForm from "../components/tabs/BirthForm";
import {Container, Stack} from '../components/Layout';
import {Heading1} from "../components/Headings";
import RegisterIndividualForm from '../components/tabs/RegisterIndividualForm';
import DeactivationForm from "../components/tabs/DeactivationForm";
import NoteForm from '../components/tabs/NoteForm';


export default function RegistrationPage() {
    return (
        <div className="w-full md:w-4/5 lg:w-2/3 m-auto">
            <Container>
                <Stack gap={"medium"}>
                    <Heading1>Registering</Heading1>
                    <Container padding={"none"}>
                        <Tabs>
                            <Tab id={"birth"} title={"Lamming"}>
                                <BirthForm/>
                            </Tab>
                            <Tab id={"create"} title={"Innmelding"}>
                                <RegisterIndividualForm/>
                            </Tab>
                            <Tab id={"delete"} title={"Utmelding"}>
                                <DeactivationForm/>
                            </Tab>
                            <Tab id={"note"} title={"Notat"}>
                                <NoteForm/>
                            </Tab>

                        </Tabs>
                    </Container>
                </Stack>
            </Container>
        </div>
    )
}
