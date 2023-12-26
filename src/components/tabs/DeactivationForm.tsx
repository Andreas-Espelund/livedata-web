import React, {useContext, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {Autocomplete, AutocompleteItem, Button, CardFooter} from "@nextui-org/react";
import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {Stack} from "@/components/Layout";
import {Heading2} from "@/components/Headings";
import {Input} from "@nextui-org/input";
import {IndividualSelector} from "@/components/IndividualSelector";
import {formatDate} from "@/api/utils";
import {deactivateIndividual} from "@/api/pocketbaseService";
import {updateIndividualStatus} from "@/api/firestore";
import {Context} from "@/App";
import NoticeWrapper from "@/components/NoticeWrapper";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import {NoticeBox} from "@/components/NoticeBox";

const individualOptions = [
    {value: 1, label: "10010"},
    {value: 2, label: "20020"},
    {value: 3, label: "30030"},
    // ... add more individuals
];


const DeactivationForm = () => {
    const {user, individuals} = useContext(Context)
    const [success, setSuccess]  = useState(false)
    const [failure, setFailure]  = useState(false)
    const [loading, setLoading] = useState(false)

    const {handleSubmit, control, setValue} = useForm({
        mode: 'onChange',
        defaultValues: {
            date: formatDate(new Date())
        }
    });

    const onSubmit = (data) => {
        setLoading(true)
        updateIndividualStatus(user?.uid, data.id, "inactive")
            .then((data) => setSuccess(true))
            .catch((err) => {setFailure(true); console.error(err)})
            .finally(() => setLoading(false))
    };

    return (
        <>
        <Card>
            <CardHeader>
                <Heading2>Utmelding</Heading2>
            </CardHeader>
            <CardBody>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack>
                        <Controller
                            name="id"
                            control={control}
                            rules={{required: true}}
                            render={({field}) => (
                                <IndividualSelector label="Individ" field={field}/>
                            )}
                        />

                        <Controller
                            name="date"
                            control={control}
                            rules={{required: true}}
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
                            name="reason"
                            control={control}
                            rules={{required: true}}
                            render={({field}) => (
                                <Autocomplete
                                    value={field?.value}
                                    onSelectionChange={(e) => field.onChange(e)}
                                    label="Årsak"
                                >
                                    <AutocompleteItem key={0}>
                                        Tapt innmark
                                    </AutocompleteItem>
                                    <AutocompleteItem key={1}>
                                        Tapt utmark
                                    </AutocompleteItem>
                                    <AutocompleteItem key={2}>
                                        Slakt
                                    </AutocompleteItem>
                                    <AutocompleteItem key={3}>
                                        Slakt heime
                                    </AutocompleteItem>
                                    <AutocompleteItem key={4}>
                                        Avlivet
                                    </AutocompleteItem>
                                    <AutocompleteItem key={5}>
                                        Annet
                                    </AutocompleteItem>
                                </Autocomplete>
                            )}
                        />

                        <Button isDisabled type="submit" color="danger" className={"ml-auto"} isLoading={loading}>
                            Bekreft utmelding
                        </Button>
                    </Stack>
                </form>
            </CardBody>
            <NoticeWrapper>
                <NoticeBox title={"Ikkje fungerende"} message={"Dette skjemaet er i arbeid"} type={"warning"}  noTimeout/>
            </NoticeWrapper>
        </Card>

            <NoticeWrapper>
                {failure && <NoticeBox title={"Noke gjekk gale"} message={"Kunne ikkje oppdatere status"} type={"danger"}/>}
                {success && <NoticeBox title={"Suksess"} message={"Ny status registrert"} type={"success"}/>}
            </NoticeWrapper>
        </>
    );
};

export default DeactivationForm;
