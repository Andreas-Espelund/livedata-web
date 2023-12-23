import React, {useContext, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {Button, Card, CardBody, Input} from "@nextui-org/react";
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

const RegisterIndividualForm = () => {
    const {handleSubmit, control, formState: {isValid}} = useForm({
        mode: 'onChange', // Validate the form on each change
        defaultValues: {
            date: formatDate(new Date())
        }
    });

    const {user} = useContext(Context)

    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)

    const onSubmit = async (data) => {
        console.log("FORMDATA", data);
        // You can perform further actions here, like sending the data to the server

        const ind: Individual = {
            id: data.id,
            mother: data.mother,
            father: data.father,
            bottle: false,
            status: "active",
            birth_date: data.date,
            gender: data.gender
        }
        if (user) {
            console.log('submitting')
            await addIndividual(user.uid,ind)
        }
    };

    return (
        <>

            <Card>
                <CardHeader>
                    <Heading2>Innmelding</Heading2>
                </CardHeader>
                <CardBody className={""}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack>
                            <Controller
                                name="id"
                                control={control}
                                defaultValue=""
                                rules={{required: true}}
                                render={({field}) => (
                                    <Input {...field} type="number" label="ID (Øremerkenummer)"/>
                                )}
                            />

                            <Controller
                                name="date"
                                control={control}
                                defaultValue=""
                                rules={{required: true}}
                                render={({field}) => (
                                    <Input {...field} type="date" placeholder=" " label="Fødtselsdato"/>
                                )}
                            />

                            <Controller
                                name="mother"
                                control={control}
                                defaultValue=""
                                //rules={{required: true}}
                                render={({field}) => (
                                    <IndividualSelector label="Mor sin ID" field={field} ewe={true}/>
                                )}
                            />

                            <Controller
                                name="father"
                                control={control}
                                defaultValue=""
                                //rules={{required: true}}
                                render={({field}) => (
                                    <IndividualSelector label="Far sin ID" field={field} ewe={false}/>
                                )}
                            />

                            <Controller
                                name="gender"
                                control={control}
                                defaultValue=""
                                rules={{required: true}}
                                render={({field}) => (

                                    <GenderSelector field={field}/>
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
