import React, {useContext} from "react";
import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import {Context} from "@/App";


export const IndividualSelector = ({label, field, ewe}: {
    label: string | undefined,
    field: any,
    ewe: boolean | undefined
}) => {

    const {individuals} = useContext(Context)


    const items = ewe === undefined ? individuals : individuals

    return (
        <Autocomplete
            label={label || "Velg et individ"}
            placeholder={label ? "Velg et individ" : ""}
            value={field?.value}
            onSelectionChange={(e) => field.onChange(e)}
        >
            {items.map(item =>
                <AutocompleteItem
                    textValue={item.id}
                    key={item.id}
                    value={item.id}
                >
                    {item.id}
                </AutocompleteItem>
            )}
        </Autocomplete>
    )
}