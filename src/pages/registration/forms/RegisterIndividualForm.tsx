import {Controller, useForm} from "react-hook-form";
import {Button, Card, CardBody, Checkbox, Input} from "@nextui-org/react";
import {CardHeader} from "@nextui-org/card";
import {Individual} from "@/types/types";
import {formatDate} from "@/util/utils";
import {addIndividual} from "@/api/firestore/individuals";
import {
    InfoPopover,
    BreederSelector,
    IndividualSelector,
    Heading2,
    Stack,
    GenderSelector,
    NoticeBox
} from "@/components";
import {yupResolver} from "@hookform/resolvers/yup";
import {newIndividualSchema} from "@/validation/newIndividualValidation";
import useStatus from "@/hooks/useStatus";


interface RegisterIndividualFormData {
    id: string;
    mother?: string | null;
    father?: string | null;
    birth_date: string;
    gender: string;
    bottle: string;
}

const RegisterIndividualForm = () => {

    const {handleSubmit, control} = useForm<RegisterIndividualFormData>({
        resolver: yupResolver(newIndividualSchema),
        defaultValues: {
            birth_date: formatDate(new Date()),
            father: null,
            mother: null,
            bottle: "0"
        }
    });

    const {loading, error, success, startLoading, setSuccessState, setErrorState, resetStatus} = useStatus()

    const onSubmit = async (data: RegisterIndividualFormData) => {
        startLoading()
        const individual = {
            ...data,
            status: "active",
            bottle: data.bottle === "1"
        } as Individual;

        console.log('submitting')
        await addIndividual(individual)
            .then(setSuccessState)
            .catch(setErrorState)
    };

    return (
        <>
            <Card>
                <CardHeader className={"flex justify-between"}>
                    <Heading2>Innmelding</Heading2>
                    <InfoPopover>
                        <p className={"font-medium"}> Tips </p>
                        <p> La mor og far stå tom viss dei ikkje er i lista </p>
                    </InfoPopover>
                </CardHeader>
                <CardBody className={""}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack>
                            <Controller
                                name="id"
                                control={control}
                                render={({field, fieldState}) => (
                                    <Input {...field} type="number" label="ID (Øremerkenummer)"
                                           errorMessage={fieldState.error?.message}/>
                                )}
                            />

                            <Controller
                                name="mother"
                                control={control}
                                render={({field, fieldState}) => (
                                    <IndividualSelector
                                        label={"Mor sin id"}
                                        field={field}
                                        fieldState={fieldState}
                                        gender={"female"}
                                    />
                                )}
                            />
                            <Controller
                                name="father"
                                control={control}
                                render={({field, fieldState}) => (
                                    <BreederSelector label={"Far sin id"} {...field}
                                                     errorMessage={fieldState.error?.message}/>
                                )}
                            />
                            <Controller
                                name="birth_date"
                                control={control}
                                render={({field, fieldState}) => (
                                    <Input {...field} type="date" placeholder=" " label="Fødtselsdato"
                                           errorMessage={fieldState.error?.message}/>
                                )}
                            />
                            <Controller
                                name="gender"
                                control={control}
                                render={({field, fieldState}) => (
                                    <GenderSelector field={field} fieldState={fieldState}/>
                                )}
                            />
                            <Controller
                                name="bottle"
                                control={control}
                                render={({field}) => (
                                    <label className={"text-sm flex items-center text-zinc-600"}>
                                        <Checkbox {...field} size={"lg"}/>
                                        Kopplam?
                                    </label>
                                )}
                            />
                            <Button type="submit" color="primary" className={"ml-auto"} isLoading={loading}>
                                Registrer individ
                            </Button>
                        </Stack>
                    </form>
                </CardBody>
            </Card>

            <div className={"fixed flex flex-col gap-4 w-1/3 top-20 right-4 z-50 "}>
                <NoticeBox
                    title={"Success"}
                    message={"Created new individual"}
                    type={"success"}
                    visible={success}
                    onClose={() => resetStatus()}
                />
                <NoticeBox
                    title={"Feil"}
                    message={"Kunne ikkje registrere individ"}
                    type={"danger"}
                    visible={error != null}
                    onClose={() => resetStatus()}
                />
            </div>

        </>
    );
};

export default RegisterIndividualForm;
