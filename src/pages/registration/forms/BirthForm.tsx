import {yupResolver} from "@hookform/resolvers/yup";

import {Controller, useFieldArray, useForm} from "react-hook-form";

import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Input,
    Textarea,
    Tooltip,
    Divider
} from "@nextui-org/react";

import {
    Stack,
    IndividualSelector,
    GenderSelector,
    Heading2,
    Heading4,
    BreederSelector,
    NoticeBox,
    NoticeWrapper,
    BottleSelector
} from "@/components/";


import {BirthRecord, Individual} from "@/types/types";
import {addIndividual} from "@/api/firestore/individuals";
import {addBirthRecord} from "@/api/firestore/registrations";
import {formatDate} from "@/util/utils";
import {useAppContext} from "@/context/AppContext";
import {birthSchema} from "@/validation/birthValidation";
import useStatus from "@/hooks/useStatus";

interface BirthFormData {
    lambs: [
        {
            id?: string;
            gender: string;
            bottle: string;
            tag: string;
        }
    ],
    mother: string;
    father: string;
    date: string;
    note?: string;
}

const BirthForm = () => {

    // validation state
    const {user} = useAppContext();

    const {loading, startLoading, error, success, setSuccessState, setErrorState, resetStatus} = useStatus()

    // form state
    const {handleSubmit, getValues, control, reset} = useForm<BirthFormData>({
        resolver: yupResolver(birthSchema),
        defaultValues: {
            lambs: [{gender: "", bottle: "0", tag: ""}],
            date: formatDate(new Date()),
        },
        mode: 'onSubmit'
    });

    // lambs state
    const {fields, append, remove} = useFieldArray({
        control,
        name: "lambs"
    });

    const onSubmit = async (data: BirthFormData) => {
        console.log(data)
        if (!user || !user.authUser) {
            console.error("User not found")
            return;
        }
        startLoading()
        const record: BirthRecord = {
            date: formatDate(data.date),
            father: data.father,
            lambs: data.lambs.map(e => e.tag),
            mother: data.mother,
            note: data.note?.trim() || ""
        }

        const lambs: Individual[] = data.lambs.map(e => {
            const ind: Individual = {
                birth_date: formatDate(data.date),
                bottle: Boolean(e.bottle),
                doc: "",
                father: data.father,
                gender: e.gender,
                id: e.tag,
                mother: data.mother,
                status: "active"
            }
            return ind
        })

        const promises = lambs.map(e => addIndividual(user?.authUser?.uid, e))
        promises.push(addBirthRecord(user?.authUser.uid, data.mother, record))

        await Promise.all(promises)
            .then(() => {
                console.log("success")
                setSuccessState()
                reset()
            })
            .catch(error => {
                console.error(error)
                setErrorState(error)
            })
    }

    const addLamb = () => {
        let prevTag = getValues(`lambs.${fields.length - 1}.tag`)
        const numeric = parseInt(prevTag)
        prevTag = isNaN(numeric) ? "" : (numeric + 1).toString()
        append({tag: prevTag, id: "", gender: "", bottle: "0"})
    }

    const handleReset = () => {
        fields.map((e, i) => remove(i))
        fields[0] = {id: '', gender: '', bottle: '', tag: ''}
    }

    return (
        <Card>
            <CardHeader className={"flex justify-between"}>
                <Heading2>Ny Lamming</Heading2>
            </CardHeader>
            <CardBody className={""}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack>
                        <Heading4> Detaljer </Heading4>
                        <Controller
                            name="mother"
                            control={control}
                            render={({field, fieldState}) => (
                                <IndividualSelector label="Mor sin ID" field={field} fieldState={fieldState}
                                                    gender={"female"}/>
                            )}
                        />

                        <Controller
                            name="father"
                            control={control}
                            render={({field, fieldState}) => (
                                <BreederSelector label="Far sin ID" field={field} fieldState={fieldState}/>
                            )}
                        />

                        <Controller
                            name="date"
                            control={control}
                            render={({field, fieldState}) => (
                                <Input {...field} type="date" placeholder=" " label="Fødtselsdato"
                                       errorMessage={fieldState.error?.message}/>
                            )}
                        />
                        <Heading4> Lam </Heading4>
                        {fields.map((field, index) => (
                            <div key={index} className={"w-full"}>
                                <div className="grid md:grid-cols-2 w-full items-center gap-4">
                                    <Controller
                                        name={`lambs.${index}.tag`}
                                        control={control}
                                        render={({field, fieldState}) => (
                                            <Input {...field} placeholder="ID (Øremerkenummer)"
                                                   onChange={field.onChange}
                                                   label={`Lam ${index + 1}`}
                                                   className={"col-span-1"} errorMessage={fieldState.error?.message}/>
                                        )}
                                    />
                                    <div className={"flex gap-4 items-center col-span-1"}>
                                        <Controller
                                            name={`lambs.${index}.gender`}
                                            control={control}
                                            render={({field, fieldState}) => (
                                                <GenderSelector field={field} fieldState={fieldState}/>
                                            )}
                                        />

                                        <Controller
                                            name={`lambs.${index}.bottle`}
                                            control={control}
                                            render={({field, fieldState}) => (
                                                <BottleSelector field={field} fieldState={fieldState}/>
                                            )}
                                        />

                                        <Tooltip content={"Fjern lam fra listen"}>
                                            <Button onPress={() => remove(index)}
                                                    color="danger"
                                                    variant="flat" isIconOnly>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     strokeWidth={1.5} stroke="currentColor"
                                                     className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                                </svg>
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </div>
                                <Divider className={"mt-2"}/>
                            </div>
                        ))}

                        <Button className={"ml-auto"} variant="light" color="primary" onPress={(e) => addLamb()}>
                            Legg til lam
                        </Button>
                        <Heading4> Notat </Heading4>

                        <Controller
                            name="note"
                            control={control}
                            render={({field}) => (
                                <Textarea
                                    {...field}
                                    placeholder="Skriv inn notat"
                                    rows={4}
                                    required
                                />
                            )}
                        />
                        <div className="flex gap-4 justify-end w-full">
                            <Button type="reset" variant={"light"} color={"danger"} onPress={handleReset}>
                                Nullstill
                            </Button>
                            <Button type="submit" color="primary" isLoading={loading}>
                                Registrer lamming
                            </Button>
                        </div>
                    </Stack>
                </form>
            </CardBody>
            <NoticeWrapper>
                <NoticeBox title={"Lamming lagret"} message={"Du kan lukke denne siden"} type={"success"}
                           visible={success} onClose={() => resetStatus()}/>
                <NoticeBox title={"Kunne ikkje lagre"} message={"Noko gjekk gale"} type={"danger"}
                           visible={error !== null} onClose={() => resetStatus()}/>
            </NoticeWrapper>
        </Card>
    )
}


export default BirthForm