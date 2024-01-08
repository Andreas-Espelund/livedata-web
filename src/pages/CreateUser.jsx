import React, {useContext} from 'react';
import { useForm, Controller } from 'react-hook-form';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/api/firebase.js'; // Update this path
import {Input, Button, Card, CardFooter} from '@nextui-org/react';
import {CardBody} from "@nextui-org/card";
import {Navigate} from "react-router-dom";
import {Context} from "@/App";

const SignUpForm = () => {
    const { reset, control, handleSubmit, formState: { errors } } = useForm();
    const {user} = useContext(Context)
    const onSubmit = async (data) => {
        const { email, password, verify } = data;
        console.log(email, password, verify)
        if (password !== verify) {
            alert("Passwords do not match");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("success")
            reset()
            // Handle successful sign-up (e.g., redirect to login page or dashboard)
        } catch (error) {
            console.error(error)
            alert(error)
            // Handle errors (e.g., email already in use, weak password)
        }
    };

    if (user) {
        return <Navigate to={"/"}/>
    }

    return (
        <div className={"flex flex-col justify-center items-center h-[100dvh]  p-4 gap-6"}>
            <h1 className={"text-3xl font-medium"}>Registrer ny bruker</h1>
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
                        <Controller
                            name="verify"
                            control={control}
                            rules={{ required: true }} // Add more validation as needed
                            render={({ field }) => (
                                <Input errorMessage={errors.verify && "Påkrevd"} type="password" {...field} label="Gjenta passord" isRequired/>
                            )}
                        />
                        <Button type="submit" color={"primary"}>Lag bruker</Button>
                    </form>
                </CardBody>
            </Card>
            <div className={"grid gap-2"}>
                <a className={"m-auto italic"} href={"/login"}> Gå til inlogging</a>
            </div>
        </div>
    );
};

export default SignUpForm;
