import React, {useContext} from "react";
import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import {Context} from "@/App";
import {useAppContext} from "@/context/AppContext";


export const IndividualSelector = ({label, field, fieldState, gender} : {
    label: string | undefined,
    field: any,
    fieldState: any
    gender: "male" | "female" | undefined
}) => {

    const {individuals} = useAppContext()

    const selectable = Array.from(individuals.values())
    const filtered = gender === undefined ? selectable : selectable.filter((ind) => ind.gender === gender)

    return (
        <Autocomplete
            label={label || "Velg et individ"}
            placeholder={label ? "Velg et individ" : ""}
            value={field?.value}
            onSelectionChange={(e) => field.onChange(e)}
            errorMessage={fieldState?.error?.message}
        >
            {filtered.map(item =>
                <AutocompleteItem
                    textValue={item.id}
                    key={item.doc}
                    value={item.id}
                >
                    {item.id}
                </AutocompleteItem>
            )}
        </Autocomplete>
    )
}