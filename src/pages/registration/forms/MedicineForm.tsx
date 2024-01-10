
import {Input, Button, Card, CardBody, CardHeader} from "@nextui-org/react";
import {Heading2, IndividualSelector, InfoPopover, NoticeBox, NoticeWrapper} from "@/components";

import {Controller, useForm} from "react-hook-form";

import useStatus from "@/hooks/useStatus";
import {addMedicineRecord} from "@/api/firestore";
import {useAppContext} from "@/context/AppContext";
import {formatDate} from "@/api/utils";
import {Simulate} from "react-dom/test-utils";
import reset = Simulate.reset;


interface FormData {
    individual: string;
    date: string;
    medicine: string;
}

const defaultValues = {
    individual: "",
    date: formatDate(new Date()),
    medicine: ""
}

export const MedicineForm = () => {
    const {user} = useAppContext()
    const {control, handleSubmit, formState} = useForm<FormData>({
        defaultValues: defaultValues,
        mode: "onChange"
    })

    const {loading, error, success, startLoading, setSuccessState, setErrorState} = useStatus()

    const onSubmit = (data: FormData) => {
        console.log(data)
        startLoading()
        addMedicineRecord(user?.authUser?.uid, data)
            .then(() => {console.log("success"); setSuccessState()})
            .catch(error => {console.error(error); setErrorState(error)})
            .finally(() => reset(defaultValues))

    }
    return (
        <>
            <Card>
                <CardHeader className={"flex justify-between"}>
                    <Heading2>Medisinering</Heading2>
                    <InfoPopover>
                        <p className={"font-semibold"}>Tips</p>
                        <p>Masseregistrering kan gjerast i besetning-sida</p>
                    </InfoPopover>
                </CardHeader>
                <CardBody>
                    <form className={"flex flex-col gap-4"} onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            name="individual"
                            control={control}
                            rules={{required: "Velg individ"}}
                            render={({field, fieldState}) =>
                                <IndividualSelector fieldState={fieldState} field={field}/>
                            }
                        />

                        <Controller
                            name="date"
                            control={control}
                            rules={{required: "Velg dato"}}
                            render={({field, fieldState}) =>
                                <Input label={"Dato"} type="date" placeholder={" "} {...field} errorMessage={fieldState.error?.message} isRequired/>}
                        />
                        <Controller
                            name="medicine"
                            control={control}
                            rules={{required: "Skriv navn på medisin"}}
                            render={({field, fieldState}) =>
                                <Input label={"Medisin"} {...field} errorMessage={fieldState.error?.message} isRequired/>}
                        />
                        <div className={"flex justify-end"}>
                            <Button color={"primary"} isLoading={loading} isDisabled={!formState.isValid} type={"submit"}>Registrer</Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
            <NoticeWrapper>
                {success && <NoticeBox title={"Suksess"} message={"Medisinering registrert"} type={"success"}/>}
                {error && <NoticeBox title={"Noko gjekk gale"} message={error} type={"danger"}/>}
            </NoticeWrapper>
        </>
    )
}