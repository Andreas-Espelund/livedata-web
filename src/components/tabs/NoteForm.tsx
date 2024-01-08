import React, {useContext, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {Button, Textarea, Image, CardFooter} from "@nextui-org/react";
import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {Row, Stack} from "@/components/Layout";
import {Heading2} from "@/components/Headings";
import {IndividualSelector} from "@/components/IndividualSelector";
import {NoticeBox} from "@/components/NoticeBox";
import NoticeWrapper from "@/components/NoticeWrapper";
import {Context} from "@/App";
import {formatDate} from "@/api/utils";
import {NoteRecord, StatusRecord} from "@/types/types";
import {addNoteRecord, updateIndividualStatus} from "@/api/firestore";
import {Input} from "@nextui-org/input";

const individualOptions = [
    {value: 1, label: "10010"},
    {value: 2, label: "20020"},
    {value: 3, label: "30030"},
    // ... add more individuals
];


const NoteForm = () => {

    const {user} = useContext(Context)
    const [success, setSuccess]  = useState(false)
    const [failure, setFailure]  = useState(false)
    const [loading, setLoading] = useState(false)

    const {handleSubmit, control, setValue, reset} = useForm({
        mode: 'onChange',
        defaultValues: {
            date: formatDate(new Date()),
            individual: "",
            note: ""
        }
    });

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            console.log(user?.uid, data)

            const noteRecord : NoteRecord = {
                date: data.date, individual: data.individual, note: data.note

            }
            await addNoteRecord(user.uid, noteRecord)


            setSuccess(true)
            reset()

            setTimeout(() => {
                setSuccess(false);
                setFailure(false);
            }, 8000); // This timeout should match the timeout in the NoticeBox component
        } catch (error) {
            console.error(error)
            setFailure(true)
        } finally {
            setLoading(false)
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <Heading2>Nytt notat</Heading2>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack>
                            <Controller
                                name="individual"
                                control={control}
                                defaultValue={null}
                                rules={{required: "Velg individ"}}
                                render={({field, fieldState}) => (
                                    <IndividualSelector label={"Individ"} field={field} fieldState={fieldState}/>
                                )}
                            />

                            <Controller
                                name="date"
                                control={control}
                                rules={{required: "Velg dato"}}
                                render={({field}) => (
                                    <Input
                                        type={"date"}
                                        label={"Dato"}
                                        {...field}
                                        placeholder=" "
                                        required
                                    />
                                )}
                            />

                            <Controller
                                name="note"
                                control={control}
                                defaultValue=""
                                rules={{required: "Skriv ett notat"}}
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
                            <Button type="submit" color="primary" className={"ml-auto"}>
                                Legg til notat
                            </Button>
                        </Stack>
                    </form>
                </CardBody>
            </Card>
            <NoticeWrapper>
                {failure && <NoticeBox title={"Noke gjekk gale"} message={"Kunne ikkje lagre notat"} type={"danger"}/>}
                {success && <NoticeBox title={"Suksess"} message={"Ny notat registrert"} type={"success"}/>}
            </NoticeWrapper>
        </>
    );
};

export default NoteForm;
