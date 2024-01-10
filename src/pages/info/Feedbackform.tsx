import {Button, Card, CardBody, Input, Textarea} from "@nextui-org/react";
import useStatus from "@/hooks/useStatus";
import {Controller, useForm} from "react-hook-form";
import {NoticeWrapper} from "@/components";
import {NoticeBox} from "@/components/NoticeBox";
import {sendFeedback} from "@/api/firestore";
import {formatDate} from "@/api/utils";


interface FormData {
    name: string;
    subject: string;
    message: string;
    date: string;
}


const defaultValues = {
    name: "",
    subject: "",
    message: "",
    date: formatDate(new Date())
}
export const Feedbackform = () => {

    const {loading, error, success, setSuccessState, setErrorState, startLoading} = useStatus()
    const {control, handleSubmit, reset, formState} = useForm<FormData>({
        defaultValues: defaultValues,
        mode: "onChange"
    })

    const onSubmit = async (data: FormData) => {
        data.date = formatDate(new Date())
        startLoading()
        console.log("submitting", data);
        sendFeedback(data)
            .then(() => setSuccessState())
            .catch((error) => setErrorState(error))
            .finally(() => reset(defaultValues))
    };
    return (
        <>
        <Card>
            <CardBody>
                <form className={"flex flex-col gap-4"} onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name={"name"}
                        control={control}
                        rules={{required: "Skriv ditt navn"}}
                        render={({ field, fieldState}) =>
                            <Input {...field} errorMessage={fieldState.error?.message} label={"Navn"} isRequired/>
                        }
                    />
                    <Controller
                        name={"subject"}
                        control={control}
                        rules={{required: "Hva gjelder tilbakemeldingen (kort)"}}
                        render={({ field, fieldState}) =>
                            <Input {...field} errorMessage={fieldState.error?.message} label={"Emne"} isRequired/>
                        }
                    />
                    <Controller
                        name={"message"}
                        control={control}
                        rules={{required: "Skriv din tilbakemelding"}}
                        render={({ field, fieldState}) =>
                            <Textarea minRows={6} {...field} errorMessage={fieldState.error?.message} label={"Melding"} isRequired/>
                        }
                    />
                    <div className={"flex justify-end items-center gap-4"}>
                        <Button isLoading={loading} isDisabled={!formState.isValid} type={"submit"} color={"primary"}>Send inn</Button>
                    </div>
                </form>
            </CardBody>
        </Card>
            <NoticeWrapper>
                {success && <NoticeBox title={"Suksess"} message={"Tilbakemelding sendt"} type={"success"} noTimeout={false}/>}
                {error && <NoticeBox title={"Feil"} message={error} type={"danger"} noTimeout={false}/>}
            </NoticeWrapper>
        </>
    )
}