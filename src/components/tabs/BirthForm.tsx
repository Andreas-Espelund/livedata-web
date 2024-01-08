import {
    Autocomplete,
    AutocompleteItem,
    Button,
    Card,
    CardBody,
    CardHeader,
    Input,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Textarea,
    Tooltip,
    Image,
    Divider
} from "@nextui-org/react";
import {Stack} from "@/components/Layout";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import {IndividualSelector} from "@/components/IndividualSelector";
import React, {useContext, useState} from "react";
import {GenderSelector} from "@/components/GenderSelector";
import {Heading2, Heading4} from "@/components/Headings";
import {BreederSelector} from "@/components/BreederSelector";
import {NoticeBox} from "@/components/NoticeBox";
import NoticeWrapper from "@/components/NoticeWrapper";
import {BirthRecord, Individual} from "@/types/types";
import {addBirthRecord, addIndividual} from "@/api/firestore";
import {Context} from "@/App";
import {formatDate} from "@/api/utils";

const BirthForm = () => {

    // validation state
    const {user} = useContext(Context);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // form state
    const {handleSubmit, control, formState: {isValid}, reset} = useForm({
        mode: 'onChange', // Validate the form on each change
        defaultValues: {
            lambs: [{id: '', gender: '', bottle: '0',}],
            mother: '',
            father: '',
            date: formatDate(new Date()),
            note: ''
        }
    });

    // lambs state
    const {fields, append, remove} = useFieldArray({
        control,
        name: "lambs"
    });

    const onSubmit = async (data: any) => {
        setIsLoading(true)
        const record: BirthRecord = {
            date: data.date, father: data.father, lambs: data.lambs.map(e => e.id), mother: data.mother, note: data.note
        }

        const lambs: Individual[] = data.lambs.map(e => {
            const ind: Individual = {
                birth_date: data.date,
                bottle: Boolean(e.bottle),
                doc: "",
                father: data.father,
                gender: e.gender,
                id: e.id,
                mother: data.mother,
                status: "active"
            }
            return ind
        })

        var promises = lambs.map(e => addIndividual(user?.uid, e))
        promises.push(addBirthRecord(user?.uid, data.mother, record))

        try {
            await Promise.all(promises)
            setIsSuccess(true)
            reset()
        } catch (error) {
            console.error(error)
            setError(true)
        } finally {
            setIsLoading(false)
        }
    }

    const addLamb = () => append({id: '', gender: '', bottle: ''})

    const handleReset = (e: any) => {
        fields.map((e, i) => remove(i))
        fields[0] = {id: '', gender: '', bottle: ''}
    }

    return (
        <Card>

            <CardHeader className={"flex justify-between"}>
                <Heading2>Ny Lamming</Heading2>
                <Popover placement="right-end">
                    <PopoverTrigger>
                        <Button isIconOnly color="warning" variant="light">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"/>
                            </svg>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div>
                            <ul className="px-1 py-2">
                                <li className="font-bold">Tips</li>
                                <li className="text-small list-disc ml-3">Trykk 'n' for å legge til lam</li>
                                <li className="text-small list-disc ml-3">Dødt før merking - dødfødt</li>
                            </ul>
                            <Image
                                src={"/public/hospital.png"}
                                className={"object-cover aspect-video"}
                                width={200}
                            />
                        </div>

                    </PopoverContent>
                </Popover>
            </CardHeader>
            <CardBody className={""}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack>
                        <Heading4> Detaljer </Heading4>
                        <Controller
                            name="mother"
                            control={control}
                            defaultValue=""
                            rules={{required: "Velg mor"}}
                            render={({field, fieldState}) => (
                                <IndividualSelector label="Mor sin ID" field={field} fieldState={fieldState} gender={"female"}/>
                            )}
                        />

                        <Controller
                            name="father"
                            control={control}
                            defaultValue=""
                            rules={{required: "Velg far"}}
                            render={({field, fieldState}) => (
                                <BreederSelector label="Far sin ID" field={field} fieldState={fieldState}/>
                            )}
                        />

                        <Controller
                            name="date"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Skriv inn dato' }}
                            render={({field, fieldState}) => (
                                <Input {...field} type="date" placeholder=" " label="Fødtselsdato" errorMessage={fieldState.error?.message}/>
                            )}
                        />
                        <Heading4> Lam </Heading4>
                        {fields.map((field, index) => (
                            <div key={field.id}>
                                <div
                                     className="grid md:grid-cols-3 w-full items-center gap-4">
                                    <Controller
                                        name={`lambs.${index}.id`}
                                        control={control}
                                        defaultValue={""}
                                        rules={{
                                            required: "ID is required",
                                            pattern: {
                                                value: /^\d{5}$/,
                                                message: "ID må være 5-sifret tall"
                                            }
                                        }}
                                        render={({field, fieldState}) => (
                                            <Input {...field} placeholder="ID (Øremerkenummer)" label={`Lam ${index + 1}`}
                                                   className={"col-span-2"} errorMessage={fieldState.error?.message}/>
                                        )}
                                    />


                                    <div className={"flex gap-4 items-center col-span-1"}>
                                        <Controller
                                            name={`lambs.${index}.gender`}
                                            control={control}
                                            defaultValue={field.gender}
                                            rules={{ required: 'Velg kjønnn' }}
                                            render={({field, fieldState}) => (
                                                <GenderSelector field={field} fieldState={fieldState}/>
                                            )}
                                        />

                                        <Controller
                                            name={`lambs.${index}.bottle`}
                                            control={control}
                                            defaultValue={field.gender}
                                            rules={{ required: 'Velg kopp' }}
                                            render={({field, fieldState}) => (
                                                <Autocomplete
                                                    label={"Kopplam?"}
                                                    value={0}
                                                    onSelectionChange={(e) => field.onChange(e)}
                                                    defaultInputValue={"Nei"}
                                                    errorMessage={fieldState.error?.message}
                                                >
                                                    <AutocompleteItem textValue="Ja" value={1} key={1}> Ja </AutocompleteItem>
                                                    <AutocompleteItem textValue="Nei" value={0} key={0}> Nei </AutocompleteItem>

                                                </Autocomplete>
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

                        <Button className={"ml-auto"} variant="faded" color="primary" onPress={(e) => addLamb()}>
                            Legg til lam
                        </Button>
                        <Heading4> Notat </Heading4>

                        <Controller
                            name="note"
                            control={control}
                            defaultValue=""
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
                            <Button type="reset" variant={"flat"} color={"danger"} onPress={handleReset}>
                                Nullstill
                            </Button>
                            <Button  type="submit" color="primary" isLoading={isLoading}>
                                Registrer lamming
                            </Button>
                        </div>
                    </Stack>
                </form>
            </CardBody>
            <NoticeWrapper>
                {isSuccess && <NoticeBox title={"Lamming lagret"} message={"Du kan lukke denne siden"} type={"success"}/>}
                {error && <NoticeBox title={"Kunne ikkje lagre"} message={"Noko gjekk gale"} type={"danger"}/>}
            </NoticeWrapper>
        </Card>
    )
}


export default BirthForm