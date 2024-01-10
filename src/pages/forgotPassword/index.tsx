import {useState} from "react";

import {Button, Card, CardBody, Input} from "@nextui-org/react";
import {NoticeWrapper, NoticeBox} from "@/components";

import {Controller, useForm} from "react-hook-form";

import {auth} from "@/api/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import {NavLink} from "react-router-dom";


export const ForgotPage = () => {
    const { reset, control, handleSubmit, formState: { errors } } = useForm();

    const [resetSent, setResetSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const handleResetPassword = async (data) => {
        setIsLoading(true)
        try {
            await sendPasswordResetEmail(auth, data.email);
        } catch (error) {
            console.error('Error sending password reset email:', error.message);
        } finally {
            setResetSent(true);
            setIsLoading(false)
        }
    };


    return (
        <div className={"flex flex-col justify-center items-center h-[100dvh]  p-4 gap-6"}>
            <h1 className={"text-3xl font-medium"}>Nullstill passord</h1>
            <Card className="w-full max-w-xl">
                <CardBody>
                    <form onSubmit={handleSubmit(handleResetPassword)} className={"grid gap-4"}>
                        <Controller
                            name="email"
                            defaultValue={""}
                            control={control}
                            rules={{ required: "Skriv inn epost" }} // Add more validation as needed
                            render={({ field, fieldState }) => (
                                <Input errorMessage={fieldState.error?.message} type="email" {...field} label="Epost" isRequired/>
                            )}
                        />

                        <Button isLoading={isLoading} type="submit" color={"primary"}>Send</Button>
                    </form>
                </CardBody>
            </Card>
            <div className={"grid gap-2"}>
                <NavLink className={"m-auto italic"} to={"/login"}> Tilbake til innlogging</NavLink>
                <NavLink className={"m-auto italic"} to={"/signup"}> Ingen bruker, lag en her!</NavLink>
            </div>

            <NoticeWrapper>
                {resetSent && <NoticeBox title={"Sendt"} message={"Sjekk innboks eller spam"} type={"success"} noTimeout={true}/>}
            </NoticeWrapper>

        </div>
    )
}