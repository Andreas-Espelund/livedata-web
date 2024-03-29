import {Input, Button, Card, CardBody, CardHeader} from "@nextui-org/react";
import {Heading2, IndividualSelector, InfoPopover, NoticeBox, NoticeWrapper} from "@/components";

import {Controller, useForm} from "react-hook-form";
import useStatus from "@/hooks/useStatus";
import {addMedicineRecord} from "@/api/firestore/registrations";
import {useAppContext} from "@/context/AppContext";
import {formatDate} from "@/util/utils";
import {yupResolver} from "@hookform/resolvers/yup";
import {medicineSchema} from "@/validation/medicineValidation";


interface MedicineFormData {
    individual: string;
    date: string;
    medicine: string;
}


export const MedicineForm = () => {
    const {user} = useAppContext()
    const {control, handleSubmit, formState} = useForm<MedicineFormData>({
        resolver: yupResolver(medicineSchema),
        defaultValues: {
            date: formatDate(new Date())
        }
    })

    const {loading, error, success, startLoading, setSuccessState, setErrorState, resetStatus} = useStatus()

    const onSubmit = (data: MedicineFormData) => {
        console.log(data)
        startLoading()
        addMedicineRecord(user?.authUser?.uid, data)
            .then(setSuccessState)
            .catch(error => {
                console.error(error);
                setErrorState(error)
            })
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
                            render={({field, fieldState}) =>
                                <IndividualSelector fieldState={fieldState} field={field}/>
                            }
                        />
                        <Controller
                            name="date"
                            control={control}
                            render={({field, fieldState}) =>
                                <Input label={"Dato"} type="date" placeholder={" "} {...field}
                                       errorMessage={fieldState.error?.message} isRequired/>
                            }
                        />
                        <Controller
                            name="medicine"
                            control={control}
                            render={({field, fieldState}) =>
                                <Input label={"Medisin"} {...field}
                                       errorMessage={fieldState.error?.message} isRequired/>
                            }
                        />
                        <div className={"flex justify-end"}>
                            <Button color={"primary"} isLoading={loading} isDisabled={!formState.isValid}
                                    type={"submit"}>Registrer</Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
            <NoticeWrapper>
                <NoticeBox title={"Suksess"} message={"Medisinering registrert"} type={"success"} visible={success}
                           onClose={resetStatus}/>
                <NoticeBox title={"Noko gjekk gale"} message={error} type={"danger"} visible={error !== null}
                           onClose={resetStatus}/>
            </NoticeWrapper>
        </>
    )
}