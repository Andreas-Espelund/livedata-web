import {Controller, useForm} from "react-hook-form";
import {Input, Button, Textarea, Card, CardBody, CardHeader} from "@nextui-org/react";
import {IndividualSelector, Stack, Heading2, NoticeBox, NoticeWrapper, InfoPopover} from "@/components";

import {formatDate} from "@/util/utils";
import {addNoteRecord} from "@/api/firestore/registrations";
import useStatus from "@/hooks/useStatus";
import {yupResolver} from "@hookform/resolvers/yup";
import {noteSchema} from "@/validation/noteValidation";


interface NoteFormData {
    individual: string;
    date: string;
    note: string;
}

const NoteForm = () => {
    const {error, success, loading, setErrorState, setSuccessState, startLoading, resetStatus} = useStatus()

    const {handleSubmit, control} = useForm<NoteFormData>({
        resolver: yupResolver(noteSchema),
        defaultValues: {
            date: formatDate(new Date()),
        }
    });

    const onSubmit = async (data: NoteFormData) => {
        startLoading()
        addNoteRecord(data)
            .then(setSuccessState)
            .catch(setErrorState)
    };

    return (
        <>
            <Card>
                <CardHeader className={"flex justify-between"}>
                    <Heading2>Nytt notat</Heading2>
                    <InfoPopover>
                        <p className={"font-semibold"}>Tips</p>
                        <p>Notat om medisingering eller helse bør registrerast under Medisinering-menyen</p>
                    </InfoPopover>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack>
                            <Controller
                                name="individual"
                                control={control}
                                render={({field, fieldState}) => (
                                    <IndividualSelector label={"Individ"} field={field} fieldState={fieldState}/>
                                )}
                            />

                            <Controller
                                name="date"
                                control={control}
                                render={({field, fieldState}) => (
                                    <Input
                                        type={"date"}
                                        label={"Dato"}
                                        errorMessage={fieldState.error?.message}
                                        {...field}
                                        placeholder=" "
                                        required
                                    />
                                )}
                            />

                            <Controller
                                name="note"
                                control={control}
                                render={({field, fieldState}) => (
                                    <Textarea
                                        label={"Notat"}
                                        {...field}
                                        placeholder="Skriv inn notat"
                                        errorMessage={fieldState.error?.message}
                                        rows={4}
                                        required
                                    />
                                )}
                            />
                            <Button type="submit" color="primary" className={"ml-auto"} isLoading={loading}>
                                Legg til notat
                            </Button>
                        </Stack>
                    </form>
                </CardBody>
            </Card>
            <NoticeWrapper>
                <NoticeBox
                    title={"Noke gjekk gale"}
                    message={"Kunne ikkje lagre notat"}
                    type={"danger"}
                    visible={error != null} onClose={resetStatus}
                />

                <NoticeBox
                    title={"Suksess"}
                    message={"Ny notat registrert"}
                    type={"success"}
                    visible={success}
                    onClose={() => resetStatus()}
                />
            </NoticeWrapper>
        </>
    );
};

export default NoteForm;