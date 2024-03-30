import {Controller, useForm} from "react-hook-form";
import {Button, Card, CardBody, CardHeader, Input} from "@nextui-org/react";
import {useAppContext} from "@/context/AppContext";
import {useEffect, useMemo} from "react";
import {UserDetail} from "@/types/types";
import {changeUserDetails} from "@/api/firestore/users";
import useStatus from "@/hooks/useStatus";
import {Heading2, NoticeBox, NoticeWrapper} from "@/components";
import {yupResolver} from "@hookform/resolvers/yup";
import {userSettingsSchema} from "@/validation/userSettingsValidation";


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

    const defaultValues = useMemo(() => ({
        firstname: user?.userDetail?.firstname,
        lastname: user?.userDetail?.lastname,
        birthdate: user?.userDetail?.birthdate,
        address: user?.userDetail?.address,
        prodno: user?.userDetail?.prodno
    }), [user])

    const {handleSubmit, control, reset} = useForm<FormInput>({
        resolver: yupResolver(userSettingsSchema),
        defaultValues: defaultValues
    })

    useEffect(() => {
        if (user) {
            reset(defaultValues);
        }
    }, [user, reset, defaultValues]);

    const onSubmit = (data: FormInput) => {
        if (!user || !user.authUser) return;
        startLoading()
        const userDetail: UserDetail = {...data, email: user.userDetail?.email || ""}

        changeUserDetails(userDetail)
            .then(() => setSuccessState())
            .catch(error => setErrorState(error.toString()))
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
                                render={({field, fieldState}) => (
                                    <Input errorMessage={fieldState.error?.message} {...field} label="Fornavn"/>
                                )}
                            />
                            <Controller
                                name="lastname"
                                control={control}
                                render={({field, fieldState}) => (
                                    <Input errorMessage={fieldState.error?.message} {...field} label="Etternavn"/>
                                )}
                            />
                        </div>

                        <Controller
                            name="birthdate"
                            control={control}
                            render={({field, fieldState}) => (
                                <Input errorMessage={fieldState.error?.message} type={"date"} {...field}
                                       label={"Fødselsdato"} placeholder=" "/>
                            )}
                        />

                        <Controller
                            name="address"
                            control={control}
                            render={({field, fieldState}) => (
                                <Input errorMessage={fieldState.error?.message} {...field} label={"Adresse"}/>
                            )}
                        />

                        <Controller
                            name="prodno"
                            control={control}
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
                <NoticeBox title={"Endringer lagret"} message={"Last siden på nytt for å se endringer"}
                           type={"success"} visible={success} onClose={resetStatus}/>
                <NoticeBox title={"Feil"} message={error?.toString() || "Noko gjekk gale"} type={"danger"}
                           visible={error !== null}
                           onClose={resetStatus}/>
            </NoticeWrapper>
        </>
    )
}

export default UserSettings;