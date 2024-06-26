import {Button, Card, CardBody, Input} from "@nextui-org/react";
import {NoticeBox, NoticeWrapper} from "@/components";

import {Controller, useForm} from "react-hook-form";

import {auth} from "@/api/firebase";
import {sendPasswordResetEmail} from "firebase/auth";
import {NavLink} from "react-router-dom";
import useStatus from "@/hooks/useStatus";
import {yupResolver} from "@hookform/resolvers/yup";
import {forgotSchema} from "@/validation/forgotValidation";


interface ForgotFormData {
    email: string;
}

export const ForgotPage = () => {

    const {success, error, loading, setSuccessState, startLoading, setErrorState, resetStatus} = useStatus()

    const {control, handleSubmit} = useForm<ForgotFormData>({
        resolver: yupResolver(forgotSchema)
    });

    const handleResetPassword = (data: ForgotFormData) => {
        startLoading()
        sendPasswordResetEmail(auth, data.email)
            .then(setSuccessState)
            .catch(setErrorState)
    };


    return (
        <div className={"flex flex-col justify-center items-center h-[100dvh]  p-4 gap-6"}>
            <h1 className={"text-3xl font-medium"}>Nullstill passord</h1>
            <Card className="w-full max-w-xl">
                <CardBody>
                    <form onSubmit={handleSubmit(handleResetPassword)} className={"grid gap-4"}>
                        <Controller
                            name="email"
                            control={control}
                            render={({field, fieldState}) => (
                                <Input errorMessage={fieldState.error?.message} type="email" {...field} label="Epost"
                                       isRequired/>
                            )}
                        />
                        <Button isLoading={loading} type="submit" color={"primary"}>Send</Button>
                    </form>
                </CardBody>
            </Card>
            <div className={"grid gap-2"}>
                <NavLink className={"m-auto italic"} to={"/login"}> Tilbake til innlogging</NavLink>
                <NavLink className={"m-auto italic"} to={"/signup"}> Ingen bruker, lag en her!</NavLink>
            </div>

            <NoticeWrapper>
                <NoticeBox title={"Sendt"} message={"Sjekk innboks eller spam"} type={"success"} visible={success}
                           onClose={resetStatus}/>
                <NoticeBox title={"Feil"} message={error?.toString() || "Noko gjekk gale"} type={"danger"}
                           visible={error !== null} onClose={resetStatus}/>
            </NoticeWrapper>

        </div>
    )
}