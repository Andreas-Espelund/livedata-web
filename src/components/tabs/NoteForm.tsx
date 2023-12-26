import React from "react";
import {Controller, useForm} from "react-hook-form";
import {Button, Textarea, Image, CardFooter} from "@nextui-org/react";
import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {Row, Stack} from "@/components/Layout";
import {Heading2} from "@/components/Headings";
import {IndividualSelector} from "@/components/IndividualSelector";
import {NoticeBox} from "@/components/NoticeBox";
import NoticeWrapper from "@/components/NoticeWrapper";

const individualOptions = [
    {value: 1, label: "10010"},
    {value: 2, label: "20020"},
    {value: 3, label: "30030"},
    // ... add more individuals
];


const NoteForm = () => {
    const {handleSubmit, control, setValue} = useForm();

    const onSubmit = (data) => {
        console.log("Form data:", data);
        // You can perform further actions here, like sending the note to the server
    };

    const individualsList = [
        {value: 1, label: "10010"},
        {value: 2, label: "20020"},
        // Add more options as needed
    ];


    return (
        <Card>
            <CardHeader>
                <Heading2>Nytt notat</Heading2>
            </CardHeader>
            <CardBody>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack>
                        <Controller
                            name="selectedIndividual"
                            control={control}
                            defaultValue={null}
                            render={({field}) => (
                                <IndividualSelector label={"Individ"} field={field}/>
                            )}
                        />
                        <Controller
                            name="note"
                            control={control}
                            defaultValue=""
                            render={({field}) => (
                                <Textarea
                                    label={"Notat"}
                                    {...field}
                                    placeholder="Skriv inn notat"
                                    rows={4}
                                    required
                                />
                            )}
                        />
                        <Button isDisabled type="submit" color="primary" className={"ml-auto"}>
                            Legg til notat
                        </Button>
                    </Stack>
                </form>
            </CardBody>
            <NoticeWrapper>
                <NoticeBox title={"Ikkje fungerende"} message={"Dette skjemaet er i arbeid"} type={"warning"}  noTimeout/>
            </NoticeWrapper>
        </Card>
    );
};

export default NoteForm;
