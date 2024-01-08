import {Button, Card, CardFooter, Input} from "@nextui-org/react";
import {CardBody} from "@nextui-org/card";
import {Controller, useForm} from "react-hook-form";
import {NoticeBox} from "@/components/NoticeBox";
import React, {useState} from "react";

import {auth} from "@/api/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import NoticeWrapper from "@/components/NoticeWrapper";


const ForgotPassword = () => {
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
                <a className={"m-auto italic"} href={"/login"}> Tilbake til innlogging</a>
                <a className={"m-auto italic"} href={"/signup"}> Ingen bruker, lag en her!</a>
            </div>

            <NoticeWrapper>
                {resetSent && <NoticeBox title={"Sendt"} message={"Sjekk innboks eller spam"} type={"success"} noTimeout={true}/>}
            </NoticeWrapper>

        </div>
    )
}

export default ForgotPassword