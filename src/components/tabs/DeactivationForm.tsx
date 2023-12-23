import React from "react";
import {Controller, useForm} from "react-hook-form";
import {Autocomplete, AutocompleteItem, Button} from "@nextui-org/react";
import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {Stack} from "@/components/Layout";
import {Heading2} from "@/components/Headings";
import {Input} from "@nextui-org/input";
import {IndividualSelector} from "@/components/IndividualSelector";
import {formatDate} from "@/api/utils";
import {deactivateIndividual} from "@/api/pocketbaseService";

const individualOptions = [
    {value: 1, label: "10010"},
    {value: 2, label: "20020"},
    {value: 3, label: "30030"},
    // ... add more individuals
];


const DeactivationForm = () => {
    const {handleSubmit, control, setValue} = useForm({
        defaultValues: {
            date: formatDate(new Date())
        }
    });

    const onSubmit = (data) => {
        deactivateIndividual(data)
        // You can perform further actions here, like sending the note to the server
    };

    return (
        <Card>
            <CardHeader>
                <Heading2>Utmelding</Heading2>
            </CardHeader>
            <CardBody>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack>
                        <Controller
                            name="id"
                            control={control}
                            defaultValue={null}
                            render={({field}) => (
                                <IndividualSelector label="Individ" field={field}/>
                            )}
                        />

                        <Controller
                            name="date"
                            control={control}
                            defaultValue=""
                            render={({field}) => (
                                <Input
                                    type={"date"}
                                    label={"Dato"}
                                    {...field}
                                    placeholder=" "
                                    required
                                />
                            )}
                        />

                        <Controller
                            name="date"
                            control={control}
                            defaultValue=""
                            render={({field}) => (
                                <Autocomplete
                                    label="Årsak"
                                >
                                    <AutocompleteItem key={0}>
                                        Tapt innmark
                                    </AutocompleteItem>
                                    <AutocompleteItem key={1}>
                                        Tapt utmark
                                    </AutocompleteItem>
                                    <AutocompleteItem key={2}>
                                        Slakt
                                    </AutocompleteItem>
                                    <AutocompleteItem key={3}>
                                        Slakt heime
                                    </AutocompleteItem>
                                    <AutocompleteItem key={4}>
                                        Avlivet
                                    </AutocompleteItem>
                                    <AutocompleteItem key={5}>
                                        Annet
                                    </AutocompleteItem>
                                </Autocomplete>
                            )}
                        />

                        <Button type="submit" color="danger" className={"ml-auto"}>
                            Bekreft utmelding
                        </Button>
                    </Stack>
                </form>
            </CardBody>
        </Card>
    );
};

export default DeactivationForm;
