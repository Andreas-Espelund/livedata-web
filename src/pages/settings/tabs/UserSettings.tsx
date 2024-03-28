import {Controller, useForm} from "react-hook-form";
import {Button, Card, Input, CardBody, CardHeader} from "@nextui-org/react";
import {useAppContext} from "@/context/AppContext";
import React, {useEffect} from "react";
import {UserDetail} from "@/types/types";
import {changeUserDetails} from "@/api/firestore/users";
import useStatus from "@/hooks/useStatus";
import {NoticeWrapper, NoticeBox, Heading2} from "@/components";


interface FormInput {
    firstname: string;
    lastname: string;
    birthdate: string;
    address: string;
    prodno: string;
}

const UserSettings = () => {
    const {user} = useAppContext()
    const {loading, error, success, setErrorState, setSuccessState, startLoading, resetStatus} = useStatus()

    const defaultValues = {
        firstname: user?.userDetail?.firstname,
        lastname: user?.userDetail?.lastname,
        birthdate: user?.userDetail?.birthdate,
        address: user?.userDetail?.address,
        prodno: user?.userDetail?.prodno
    }

    const {handleSubmit, control, reset} = useForm<FormInput>({
        defaultValues: defaultValues
    })

    useEffect(() => {
        if (user) {
            reset(defaultValues);
        }
    }, [user, reset]);

    const onSubmit = (data: FormInput) => {
        if (!user || !user.authUser) return;
        startLoading()
        const userDetail: UserDetail = {...data, email: user.userDetail?.email || ""}

        changeUserDetails(user.authUser?.uid, userDetail)
            .then(() => setSuccessState())
            .catch(error => setErrorState(error.toString()))

        resetStatus();
        reset();
    }
    return (
        <>
            <Card fullWidth>
                <CardHeader>
                    <Heading2>Brukerinfo</Heading2>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit(onSubmit)} className={"grid gap-4"}>
                        <div className={"grid grid-cols-2 gap-4"}>
                            <Controller
                                name="firstname"
                                control={control}
                                rules={{required: "Skriv ditt navn"}} // Add more validation as needed
                                render={({field, fieldState}) => (
                                    <Input errorMessage={fieldState.error?.message} {...field} label="Fornavn"/>
                                )}
                            />
                            <Controller
                                name="lastname"
                                control={control}
                                rules={{required: "Skriv ditt navn"}} // Add more validation as needed
                                render={({field, fieldState}) => (
                                    <Input errorMessage={fieldState.error?.message} {...field} label="Etternavn"/>
                                )}
                            />
                        </div>

                        <Controller
                            name="birthdate"
                            control={control}
                            rules={{required: "Skriv din fødselsdato"}} // Add more validation as needed
                            render={({field, fieldState}) => (
                                <Input errorMessage={fieldState.error?.message} type={"date"} {...field}
                                       label={"Fødselsdato"} placeholder=" "/>
                            )}
                        />

                        <Controller
                            name="address"
                            control={control}
                            rules={{required: "Skriv din adresse"}} // Add more validation as needed
                            render={({field, fieldState}) => (
                                <Input errorMessage={fieldState.error?.message} {...field} label={"Adresse"}/>
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
                                <Input errorMessage={fieldState.error?.message}  {...field} label={"Produsentnummer"}/>
                            )}
                        />

                        <div className={"flex justify-end"}>
                            <Button type="submit" color={"primary"} isLoading={loading}>Lagre endringer</Button>
                        </div>
                    </form>
                </CardBody>
            </Card>

            <NoticeWrapper>
                {success && <NoticeBox title={"Endringer lagret"} message={"Last siden på nytt for å se endringer"}
                                       type={"success"} noTimeout={false}/>}
                {error && <NoticeBox title={"En feil oppstod"} message={error} type={"danger"} noTimeout={false}/>}
            </NoticeWrapper>
        </>
    )
}

export default UserSettings;