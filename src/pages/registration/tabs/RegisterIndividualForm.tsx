import React, {useContext, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {Button, Card, CardBody, Checkbox, Input} from "@nextui-org/react";
import {Stack} from "@/components/Layout";
import {Heading2} from "@/components/Headings";
import {IndividualSelector} from "@/components/IndividualSelector";
import {GenderSelector} from "@/components/GenderSelector";
import {CardHeader} from "@nextui-org/card";
import {Individual} from "@/types/types";
import {createIndividual} from "@/api/pocketbaseService";
import {NoticeBox} from "@/components/NoticeBox";
import {formatDate} from "@/api/utils";
import {addIndividual} from "@/api/firestore";
import {Context} from "@/App";
import firebase from "firebase/compat";
import {BreederSelector} from "@/components/BreederSelector";
import {useAppContext} from "@/context/AppContext";
import {InfoPopover} from "@/components";

const RegisterIndividualForm = () => {
    const {handleSubmit, control, formState: {isValid}} = useForm({
        mode: 'onBlur', // Validate the form on each change
        defaultValues: {
            date: formatDate(new Date()),
            gender: "female",
            father: null,
            mother: null,
            bottle: false
        }
    });

    const {user} = useAppContext()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)

    const onSubmit = async (data) => {

        setLoading(true)
        console.log("FORMDATA", data);
        // You can perform further actions here, like sending the data to the server

        const ind: Individual = {
            id: data.id,
            mother: data.mother,
            father: data.father,
            bottle: data.bottle,
            status: "active",
            birth_date: data.date,
            gender: data.gender
        }
        if (user) {
            console.log('submitting')
            await addIndividual(user.uid,ind)
                .then(res => setSuccess(true))
                .catch(err => {console.error(err); setError(true)})
                .finally(() => setLoading(false))
        } else {
            setError(true)
            setLoading(false)
        }
    };

    return (
        <>

            <Card>
                <CardHeader className={"flex justify-between"}>
                    <Heading2>Innmelding</Heading2>
                    <InfoPopover>
                        <p className={"font-medium"}> Tips </p>
                        <p> La mor og far stå tom viss dei ikkje er i lista </p>
                    </InfoPopover>
                </CardHeader>
                <CardBody className={""}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack>
                            <Controller
                                name="id"
                                control={control}
                                rules={{
                                    required: "ID is required",
                                    pattern: {
                                        value: /^\d{5}$/,
                                        message: "ID må være 5-sifret tall"
                                    }
                                }}
                                render={({field, fieldState}) => (
                                    <Input {...field} type="number" label="ID (Øremerkenummer)" errorMessage={fieldState.error?.message}/>
                                )}
                            />


                            <Controller
                                name="mother"
                                control={control}
                                render={({field,fieldState}) => (
                                    <IndividualSelector label={"Mor sin id"} field={field} fieldState={fieldState} gender={"female"}/>
                                )}
                            />

                            <Controller
                                name="father"
                                control={control}
                                render={({field, fieldState}) => (
                                    <BreederSelector label={"Far sin id"} field={field} fieldState={fieldState}/>
                                )}
                            />

                            <Controller
                                name="date"
                                control={control}
                                rules={{required: "Velg dato"}}
                                render={({field, fieldState}) => (
                                    <Input {...field} type="date" placeholder=" " label="Fødtselsdato" errorMessage={fieldState.error?.message}/>
                                )}
                            />


                            <Controller
                                name="gender"
                                control={control}
                                rules={{required: "Velg kjønn"}}
                                render={({field, fieldState}) => (
                                    <GenderSelector field={field} fieldState={fieldState}/>
                                )}
                            />

                            <Controller
                                name="bottle"
                                control={control}
                                render={({field}) => (
                                    <label className={"text-sm flex items-center text-zinc-600"}>
                                        <Checkbox {...field} size={"lg"} />
                                        Kopplam?
                                    </label>
                                )}
                            />
                            <Button type="submit" color="primary" className={"ml-auto"} isDisabled={!isValid}>
                                Registrer individ
                            </Button>
                        </Stack>
                    </form>
                </CardBody>
            </Card>

            <div className={"fixed flex flex-col gap-4 w-1/3 top-20 right-4 z-50 "}>
                {success && <NoticeBox title={"Success"} message={"Created new individual"} type={"success"}/>}
                {error && <NoticeBox title={"Feil"} message={"Kunne ikkje registrere individ"} type={"danger"}/>}
            </div>

        </>
    );
};

export default RegisterIndividualForm;
