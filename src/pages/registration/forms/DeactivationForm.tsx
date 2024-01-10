import React, {useContext, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {Autocomplete, AutocompleteItem, Button, CardFooter, Textarea} from "@nextui-org/react";
import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {Input} from "@nextui-org/input";
import {formatDate} from "@/api/utils";
import {updateIndividualStatus} from "@/api/firestore";

import {StatusRecord} from "@/types/types";
import {useAppContext} from "@/context/AppContext";

import {IndividualSelector, Stack, Heading2, NoticeBox, NoticeWrapper, InfoPopover} from "@/components";

const DeactivationForm = () => {
    const {user} = useAppContext()
    const [success, setSuccess]  = useState(false)
    const [failure, setFailure]  = useState(false)
    const [loading, setLoading] = useState(false)

    const {handleSubmit, control, setValue, reset} = useForm({
        mode: 'onChange',
        defaultValues: {
            date: formatDate(new Date()),
            individual: "",
            status: "slaught",
            note: ""
        }
    });

    const onSubmit = async (data) => {

        if (!user || !user.authUser) return;
        setLoading(true)
        try {
            const statusRecord : StatusRecord = {
                date: data.date, individual: data.individual, note: data.note, status: data.status
            }
            await updateIndividualStatus(user.authUser.uid, statusRecord)

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
            <CardHeader className={"flex justify-between"}>
                <Heading2>Utmelding</Heading2>
                <InfoPopover>
                    <p className={"font-semibold"}>Tips</p>
                    <p>Dersom ingen av kategoriane passar, velg 'Annet' og skriv ein kommentar</p>
                </InfoPopover>
            </CardHeader>
            <CardBody>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack>
                        <Controller
                            name="individual"
                            control={control}
                            rules={{required: "Velg ett individ"}}
                            render={({field, fieldState}) => (
                                <IndividualSelector gender={undefined} label="Individ" field={field} fieldState={fieldState}/>
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
                            name="status"
                            control={control}
                            rules={{required: "Velg utmeldingsårsak"}}
                            render={({field}) => (
                                <Autocomplete
                                    value={field?.value}
                                    onSelectionChange={(e) => field.onChange(e)}
                                    defaultSelectedKey={field?.value}
                                    label="Årsak"
                                >
                                    <AutocompleteItem key={"lost_in"}>
                                        Tapt innmark
                                    </AutocompleteItem>
                                    <AutocompleteItem key={"lost_out"}>
                                        Tapt utmark
                                    </AutocompleteItem>
                                    <AutocompleteItem key={"slaught"}>
                                        Slakt
                                    </AutocompleteItem>
                                    <AutocompleteItem key={"slaught_home"}>
                                        Slakt heime
                                    </AutocompleteItem>
                                    <AutocompleteItem key={"euthanized"}>
                                        Avlivet
                                    </AutocompleteItem>
                                    <AutocompleteItem key={"inactive"}>
                                        Annet
                                    </AutocompleteItem>
                                </Autocomplete>
                            )}
                        />

                        <Controller
                            name="note"
                            control={control}
                            defaultValue=""
                            render={({field}) => (
                                <Textarea
                                    {...field}
                                    placeholder="Skriv inn notat"
                                    rows={4}
                                    required
                                />
                            )}
                        />
                        <Button type="submit" color="danger" className={"ml-auto"} isLoading={loading}>
                            Bekreft utmelding
                        </Button>
                    </Stack>
                </form>
            </CardBody>
        </Card>

            <NoticeWrapper>
                {failure && <NoticeBox title={"Noke gjekk gale"} message={"Kunne ikkje oppdatere status"} type={"danger"}/>}
                {success && <NoticeBox title={"Suksess"} message={"Ny status registrert"} type={"success"}/>}
            </NoticeWrapper>
        </>
    );
};

export default DeactivationForm;
