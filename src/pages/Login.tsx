import React, {useContext, useState} from 'react';
import {useForm, Controller, set} from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/api/firebase.js'; // Update this path
import {Input, Button, Card, CardFooter, user} from '@nextui-org/react';
import {CardBody} from "@nextui-org/card";
import {Navigate, useNavigate} from "react-router-dom";
import {NoticeBox} from "@/components/NoticeBox";
import {Context} from "@/App";

const LoginPage = () => {
    const { reset, control, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const {user} = useContext(Context)
    const onSubmit = async (data) => {
        setLoading(true)
        setError(false)
        const { email, password } = data;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/')
        } catch (error) {
            console.error(error);
            setError(true)
        } finally {
            setLoading(false)
        }
    };

    if (user) {
        return <Navigate to={"/"}/>
    }
    return (
        <div className={"flex flex-col justify-center items-center h-[100dvh]  p-4 gap-6"}>
            <h1 className={"text-3xl font-medium"}>Logg inn</h1>
            <Card className="w-full max-w-xl">
                <CardBody>
                    <form onSubmit={handleSubmit(onSubmit)} className={"grid gap-4"}>
                        <Controller
                            name="email"
                            control={control}
                            rules={{ required: true }} // Add more validation as needed
                            render={({ field }) => (
                                <Input errorMessage={errors.email && "Påkrevd"} type="email" {...field} label="Epost" isRequired/>
                            )}
                        />
                        <Controller
                            name="password"
                            control={control}
                            rules={{ required: true }} // Add more validation as needed
                            render={({ field }) => (
                                <Input errorMessage={errors.password && "Påkrevd"} type="password" {...field} label="Passord" isRequired/>
                            )}
                        />
                        <Button isLoading={loading} type="submit" color={"primary"}>Logg inn</Button>
                    </form>
                </CardBody>
            </Card>

            <div className={"grid gap-2"}>
                <a className={"m-auto italic"} href={"/signup"}> Registrer bruker</a>
                <a className={"m-auto italic"} href={"/forgot"}> Glemt passord?</a>
            </div>

            <div className={"fixed top-10  flex right-4"}>
                {error && <NoticeBox title={"Kunne ikkje logge inn"} message={"Sjekk at passord og brukernavn er riktig"} type={"warning"}/>}
            </div>
        </div>
    );
};

export default LoginPage;
