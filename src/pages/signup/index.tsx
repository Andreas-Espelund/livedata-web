import {Controller, useForm} from 'react-hook-form';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {auth} from '@/api/firebase.js';
import {Button, Card, Divider, Input} from '@nextui-org/react';
import {CardBody} from "@nextui-org/card";
import {Navigate, NavLink} from "react-router-dom";

import {useAppContext} from "@/context/AppContext";
import {addUserDetails} from "@/api/firestore/users";
import {UserDetail} from "@/types/types";
import useStatus from "@/hooks/useStatus";
import {NoticeBox, NoticeWrapper} from "@/components";
import {yupResolver} from "@hookform/resolvers/yup";
import {signupSchema} from "@/validation/signupValidation";


interface SignupFormData {
    firstname: string;
    lastname: string;
    birthdate: string;
    address: string
    prodno: string;
    email: string;
    password: string;
    validation: string;
}


export const SignUpPage = () => {

    const {success, error, loading, setSuccessState, setErrorState, startLoading, resetStatus} = useStatus()
    const {control, handleSubmit} = useForm<SignupFormData>({
        resolver: yupResolver(signupSchema)
    });
    const {user} = useAppContext()
    const onSubmit = async (data: SignupFormData) => {
        startLoading()
        const {email, password, validation} = data;
        console.log(email, password, validation)
        if (password !== validation) {
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
                                render={({field, fieldState}) => (
                                    <Input errorMessage={fieldState.error?.message} {...field} label="Fornavn"
                                           isRequired/>
                                )}
                            />
                            <Controller
                                name="lastname"
                                control={control}
                                render={({field, fieldState}) => (
                                    <Input errorMessage={fieldState.error?.message} {...field} label="Etternavn"
                                           isRequired/>
                                )}
                            />
                        </div>

                        <Controller
                            name="birthdate"
                            control={control}
                            render={({field, fieldState}) => (
                                <Input errorMessage={fieldState.error?.message} type={"date"} {...field}
                                       label={"Fødselsdato"} placeholder=" " isRequired/>
                            )}
                        />

                        <Controller
                            name="address"
                            control={control}
                            render={({field, fieldState}) => (
                                <Input errorMessage={fieldState.error?.message} {...field} label={"Adresse"}
                                       isRequired/>
                            )}
                        />

                        <Controller
                            name="prodno"
                            control={control}
                            render={({field, fieldState}) => (
                                <Input errorMessage={fieldState.error?.message}  {...field} label={"Produsentnummer"}
                                       isRequired/>
                            )}
                        />

                        <Divider/>

                        <Controller
                            name="email"
                            control={control}
                            render={({field, fieldState}) => (
                                <Input errorMessage={fieldState.error?.message} type="email" {...field} label="Epost"
                                       isRequired/>
                            )}
                        />
                        <Controller
                            name="password"
                            control={control}
                            render={({field, fieldState}) => (
                                <Input errorMessage={fieldState.error?.message} type="password" {...field}
                                       label="Passord" isRequired/>
                            )}
                        />
                        <Controller
                            name="validation"
                            control={control}
                            render={({field, fieldState}) => (
                                <Input errorMessage={fieldState.error?.message} type="password" {...field}
                                       label="Gjenta passord" isRequired/>
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
