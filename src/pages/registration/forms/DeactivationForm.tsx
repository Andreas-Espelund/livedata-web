import {Controller, useForm} from "react-hook-form";
import useStatus from "@/hooks/useStatus";
import {yupResolver} from "@hookform/resolvers/yup";
import {StatusRecord} from "@/types/types";
import {deactivationSchema} from "@/validation/deactivationValidation";
import {updateIndividualStatus} from "@/api/firestore/individuals";


import {Button, Card, CardBody, CardHeader, Input, Textarea} from "@nextui-org/react";
import {
    DeactivationSelector,
    Heading2,
    IndividualSelector,
    InfoPopover,
    NoticeBox,
    NoticeWrapper,
    Stack
} from "@/components";
import {formatDate} from "@/util/utils";

interface DeactivationFormData {
    individual: string;
    date: string;
    status: string;
    note?: string;
}


const DeactivationForm = () => {

    const {loading, error, success, startLoading, setSuccessState, setErrorState, resetStatus} = useStatus()

    const {handleSubmit, control, reset} = useForm<DeactivationFormData>({
        resolver: yupResolver(deactivationSchema),
        defaultValues: {
            date: formatDate(new Date()),
            status: "slaught",
        }
    });

    const onSubmit = async (data: DeactivationFormData) => {
        startLoading()

        const statusRecord: StatusRecord = {
            date: data.date,
            individual: data.individual,
            note: data.note || "",
            status: data.status
        }
        await updateIndividualStatus(statusRecord)
            .then(setSuccessState)
            .catch(setErrorState)
            .finally(reset)

    };

    return (
        <>
            <Card>
                <CardHeader className={"flex justify-between"}>
                    <Heading2>Utmelding</Heading2>
                    <InfoPopover>
                        <p className={"font-semibold"}>Tips</p>
                        <p>Dersom ingen av kategoriane passar, velg [Annet] og skriv ein kommentar</p>
                    </InfoPopover>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack>
                            <Controller
                                name="individual"
                                control={control}
                                render={({field, fieldState}) => (
                                    <IndividualSelector
                                        gender={undefined}
                                        label="Individ"
                                        field={field}
                                        fieldState={fieldState}/>
                                )}
                            />

                            <Controller
                                name="date"
                                control={control}
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
                                render={({field, fieldState}) => (
                                    <DeactivationSelector {...field} errorMessage={fieldState.error?.message}/>
                                )}
                            />
                            <Controller
                                name="note"
                                control={control}
                                render={({field}) => (
                                    <Textarea {...field} placeholder="Skriv inn notat" rows={4} required/>
                                )}
                            />
                            <div className={"flex gap-4 justify-end-end ml-auto"}>
                                <Button type="reset" color={"danger"} variant={"light"}>
                                    Nullstill
                                </Button>
                                <Button type="submit" color="primary" isLoading={loading}>
                                    Bekreft utmelding
                                </Button>
                            </div>
                        </Stack>
                    </form>
                </CardBody>
            </Card>
            <NoticeWrapper>

                <NoticeBox title={"Suksess"} message={"Ny status registrert"} type={"success"} visible={success}
                           onClose={resetStatus}/>
                <NoticeBox title={"Noke gjekk gale"} message={"Kunne ikkje oppdatere status"} type={"danger"}
                           visible={error !== null} onClose={resetStatus}/>
            </NoticeWrapper>
        </>
    );
};

export default DeactivationForm;
