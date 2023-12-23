import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import React from "react";

export const GenderSelector = ({field, className}: {
    field: any,
    className: string | undefined
}) => {

    return (
        <Autocomplete
            value={field.value}
            className={className}
            label={"Velg kjønn"}
            onSelectionChange={(e) => field.onChange(e)}
        >
            <AutocompleteItem
                textValue="Søye"
                value="female"
                key={"female"}
            >
                Søye
            </AutocompleteItem>
            <AutocompleteItem
                textValue="Veir"
                value="male"
                key={"male"}
            >
                Veir
            </AutocompleteItem>

        </Autocomplete>
    )
}
