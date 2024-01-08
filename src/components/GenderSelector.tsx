import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import React from "react";


interface GenderSelectorProps {
    field: any,
    fieldState: any,
}
export const GenderSelector = ({field, fieldState}: GenderSelectorProps) => {

    return (
        <Autocomplete
            value={field.value}
            label={"Velg kjønn"}
            onSelectionChange={(e) => field.onChange(e)}
            defaultSelectedKey={field.value}
            errorMessage={fieldState?.error?.message}
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
