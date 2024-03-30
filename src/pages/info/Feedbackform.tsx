import {Button, Card, CardBody, Input, Textarea} from "@nextui-org/react";
import useStatus from "@/hooks/useStatus";
import {Controller, useForm} from "react-hook-form";
import {NoticeWrapper} from "@/components";
import {NoticeBox} from "@/components/NoticeBox";
import {sendFeedback} from "@/api/firestore/users";
import {formatDate} from "@/util/utils";
import {feedbackSchema} from "@/validation/feedbackValidation";
import {yupResolver} from "@hookform/resolvers/yup";


interface FeedbackFormData {
    name: string;
    subject: string;
    message: string;
    date: string;
}


export const Feedbackform = () => {

    const {loading, error, success, setSuccessState, setErrorState, startLoading, resetStatus} = useStatus()
    const {control, handleSubmit, formState} = useForm<FeedbackFormData>({
        resolver: yupResolver(feedbackSchema)
    })

    const onSubmit = async (data: FeedbackFormData) => {
        data.date = formatDate(new Date())
        startLoading()
        sendFeedback(data)
            .then(() => setSuccessState())
            .catch((error) => setErrorState(error))
    };
    return (
        <>
            <Card>
                <CardBody>
                    <form className={"flex flex-col gap-4"} onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            name={"name"}
                            control={control}
                            render={({field, fieldState}) =>
                                <Input {...field} errorMessage={fieldState.error?.message} label={"Navn"} isRequired/>
                            }
                        />
                        <Controller
                            name={"subject"}
                            control={control}
                            render={({field, fieldState}) =>
                                <Input {...field} errorMessage={fieldState.error?.message} label={"Emne"} isRequired/>
                            }
                        />
                        <Controller
                            name={"message"}
                            control={control}
                            render={({field, fieldState}) =>
                                <Textarea minRows={6} {...field} errorMessage={fieldState.error?.message}
                                          label={"Melding"} isRequired/>
                            }
                        />
                        <div className={"flex justify-end items-center gap-4"}>
                            <Button isLoading={loading} isDisabled={!formState.isValid} type={"submit"}
                                    color={"primary"}>Send inn</Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
            <NoticeWrapper>

                <NoticeBox title={"Suksess"} message={"Tilbakemelding sendt"} type={"success"} visible={success}
                           onClose={resetStatus}/>
                <NoticeBox title={"Feil"} message={error?.message || "Noko gjekk gale"} type={"danger"}
                           noTimeout={false} visible={error !== null} onClose={resetStatus}/>
            </NoticeWrapper>
        </>
    )
}