import {
    Autocomplete,
    AutocompleteItem,
    Button,
    Card,
    CardBody,
    Input,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Textarea,
    Tooltip,
    Image
} from "@nextui-org/react";
import {Stack} from "@/components/Layout";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import {IndividualSelector} from "@/components/IndividualSelector";
import React, {useEffect} from "react";
import {GenderSelector} from "@/components/GenderSelector";
import {Heading2, Heading4} from "@/components/Headings";
import {CardHeader} from "@nextui-org/card";
import {BreederSelector} from "@/components/BreederSelector";

const formatDate = (date) => {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
};

const BirthForm = () => {
    const {handleSubmit, control, formState: {isValid}} = useForm({
        mode: 'onChange', // Validate the form on each change
        defaultValues: {
            lambs: [{id: '', gender: '', bottle: '', deadborn: ''}],
            mother: '',
            father: '',
            date: formatDate(new Date()),
            note: ''
        }
    });

    const {fields, append, remove} = useFieldArray({
        control,
        name: "lambs"
    });

    const onSubmit = (e) => {
        alert(e)
    }

    const addLamb = () => append({id: '', gender: '', bottle: '', deadborn: ''})

    const keyHandler = (event) => {
        if (event.key == 'n') {
            if (document.activeElement.tagName !== 'INPUT') {
                // Prevent 'n' from being added to any field
                event.preventDefault();
                addLamb()
            }
        }

    }

    useEffect(() => {
        window.addEventListener("keydown", keyHandler)

        return () => {
            window.removeEventListener("keydown", keyHandler)
        }
    }, [append])

    const removable = fields.length > 1

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
                            rules={{required: true}}
                            render={({field}) => (
                                <IndividualSelector label="Mor sin ID" field={field}/>
                            )}
                        />

                        <Controller
                            name="father"
                            control={control}
                            defaultValue=""
                            rules={{required: true}}
                            render={({field}) => (
                                <BreederSelector label="Far sin ID" field={field}/>
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
                        <Heading4> Lam </Heading4>
                        {fields.map((field, index) => (
                            <div key={field.id}
                                 className="flex w-full items-center gap-4">
                                <Controller
                                    name={`lambs.${index}.id`}
                                    control={control}
                                    defaultValue={""}
                                    render={({field}) => (
                                        <Input {...field} placeholder="ID (Øremerkenummer)" label={`Lam ${index + 1}`}
                                               className={"w-[200%]"}/>
                                    )}
                                />

                                <Controller
                                    name={`lambs.${index}.gender`}
                                    control={control}
                                    defaultValue={field.gender}
                                    render={({field}) => (
                                        <GenderSelector field={field}/>
                                    )}
                                />

                                <Controller
                                    name={`lambs.${index}.bottle`}
                                    control={control}
                                    defaultValue={field.gender}
                                    render={({field}) => (
                                        <Autocomplete
                                            label={"Kopplam?"}
                                            value={0}
                                            onSelectionChange={(e) => field.onChange(e)}
                                            defaultInputValue={"Nei"}
                                        >
                                            <AutocompleteItem textValue="Ja" value={1} key={1}> Ja </AutocompleteItem>
                                            <AutocompleteItem textValue="Nei" value={0} key={0}> Nei </AutocompleteItem>

                                        </Autocomplete>
                                    )}
                                />

                                <Controller
                                    name={`lambs.${index}.deadborn`}
                                    control={control}
                                    defaultValue={field.gender}
                                    render={({field}) => (
                                        <Autocomplete
                                            label={"Dødfødt?"}
                                            value={0}
                                            onSelectionChange={(e) => field.onChange(e)}
                                            defaultInputValue={"Nei"}
                                        >
                                            <AutocompleteItem textValue="Ja" value={1} key={1}> Ja </AutocompleteItem>
                                            <AutocompleteItem textValue="Nei" value={0} key={0}> Nei </AutocompleteItem>

                                        </Autocomplete>

                                    )}
                                />


                                <Tooltip content={removable ? "Fjern lam fra listen" : "Lammingen må ha minst ett lam"}>
                                    <Button onClick={() => remove(index)}
                                            color="danger"
                                            variant="flat" isIconOnly
                                            disabled={!removable}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth={1.5} stroke="currentColor"
                                             className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                        </svg>
                                    </Button>
                                </Tooltip>
                            </div>
                        ))}

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
                            <Button variant="faded" color="primary" onClick={(e) => addLamb()}>
                                Legg til lam
                            </Button>

                            <Button type="submit" color="primary" isDisabled={!isValid}>
                                Registrer individ
                            </Button>
                        </div>


                    </Stack>
                </form>
            </CardBody>
        </Card>
    )
}


export default BirthForm