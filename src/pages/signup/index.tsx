import {useForm, Controller} from 'react-hook-form';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {auth} from '@/api/firebase.js';
import {Input, Button, Card, Divider} from '@nextui-org/react';
import {CardBody} from "@nextui-org/card";
import {Navigate, NavLink} from "react-router-dom";

import {useAppContext} from "@/context/AppContext";
import {addUserDetails} from "@/api/firestore/users";
import {UserDetail} from "@/types/types";
import useStatus from "@/hooks/useStatus";
import {NoticeBox, NoticeWrapper} from "@/components";


interface FormInput {
    firstname: string;
    lastname: string;
    birthdate: string;
    address: string;
    prodno: string;
    email: string;
    password: string;
    verify: string;
}


export const SignUpPage = () => {

    const {success, error, loading, setSuccessState, setErrorState, startLoading, resetStatus} = useStatus()
    const {control, handleSubmit, formState: {errors}} = useForm<FormInput>({
        reValidateMode: "onChange"
    });
    const {user} = useAppContext()
    const onSubmit = async (data: FormInput) => {
        startLoading()
        const {email, password, verify} = data;
        console.log(email, password, verify)
        if (password !== verify) {
            alert("Passwords do not match");
            resetStatus()
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                const userDetails: UserDetail = {
                    firstname: data.firstname,
                    lastname: data.lastname,
                    birthdate: data.birthdate,
                    address: data.address,
                    prodno: data.prodno,
                    email: data.email // Optional, if you want to store email in Firestore as well
                };
                addUserDetails(userDetails)
                    .then(setSuccessState)
                    .catch(setErrorState)
            })
            .catch(setErrorState)
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

                        <div className={"grid grid-cols-2 gap-4"}>
                            <Controller
                                name="firstname"
                                control={control}
                                rules={{required: "Skriv ditt navn"}} // Add more validation as needed
                                render={({field, fieldState}) => (
                                    <Input errorMessage={fieldState.error?.message} {...field} label="Fornavn"
                                           isRequired/>
                                )}
                            />
                            <Controller
                                name="lastname"
                                control={control}
                                rules={{required: "Skriv ditt navn"}} // Add more validation as needed
                                render={({field, fieldState}) => (
                                    <Input errorMessage={fieldState.error?.message} {...field} label="Etternavn"
                                           isRequired/>
                                )}
                            />
                        </div>

                        <Controller
                            name="birthdate"
                            control={control}
                            rules={{required: "Skriv din fødselsdato"}} // Add more validation as needed
                            render={({field, fieldState}) => (
                                <Input errorMessage={fieldState.error?.message} type={"date"} {...field}
                                       label={"Fødselsdato"} placeholder=" " isRequired/>
                            )}
                        />

                        <Controller
                            name="address"
                            control={control}
                            rules={{required: "Skriv din adresse"}} // Add more validation as needed
                            render={({field, fieldState}) => (
                                <Input errorMessage={fieldState.error?.message} {...field} label={"Adresse"}
                                       isRequired/>
                            )}
                        />

                        <Controller
                            name="prodno"
                            control={control}
                            rules={{
                                required: "Skriv ditt produsentnummer",
                                pattern: {
                                    value: /^\d{10}$/,
                                    message: "Produsentnummeret må være et 10-sifret tall"
                                }
                            }}
                            render={({field, fieldState}) => (
                                <Input errorMessage={fieldState.error?.message}  {...field} label={"Produsentnummer"}
                                       isRequired/>
                            )}
                        />

                        <Divider/>

                        <Controller
                            name="email"
                            control={control}
                            rules={{required: true}} // Add more validation as needed
                            render={({field}) => (
                                <Input errorMessage={errors.email && "Påkrevd"} type="email" {...field} label="Epost"
                                       isRequired/>
                            )}
                        />
                        <Controller
                            name="password"
                            control={control}
                            rules={{required: true}} // Add more validation as needed
                            render={({field}) => (
                                <Input errorMessage={errors.password && "Påkrevd"} type="password" {...field}
                                       label="Passord" isRequired/>
                            )}
                        />
                        <Controller
                            name="verify"
                            control={control}
                            rules={{
                                required: "Please confirm your password",
                                validate: value => value === control._getWatch("password") || "Passwords do not match"
                            }}
                            render={({field}) => (
                                <Input errorMessage={errors.verify?.message} type="password" {...field}
                                       label="Gjenta passord" isRequired color={errors.verify ? "danger" : undefined}/>
                            )}
                        />
                        <Button type="submit" color={"primary"} isLoading={loading}>Lag bruker</Button>
                    </form>
                </CardBody>
            </Card>
            <div className={"grid gap-2"}>
                <NavLink className={"m-auto italic"} to={"/login"}> Gå til inlogging</NavLink>
            </div>

            <NoticeWrapper>
                <NoticeBox title={"Suksess"} message={"Bruker registrert"} type={"success"} visible={success}
                           onClose={resetStatus}/>
                <NoticeBox title={"Noko gjekk gale"} message={error?.toString() || "Noko gjekk gale"} type={"danger"}
                           visible={error !== null}
                           onClose={resetStatus}/>
            </NoticeWrapper>
        </div>
    );
};
