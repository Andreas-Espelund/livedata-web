import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import React from "react";

export const DeactivationSelector = ({field, fieldState}) => {
    return (
        <Autocomplete
            value={field?.value}
            onSelectionChange={(e) => field.onChange(e)}
            defaultSelectedKey={field?.value}
            label="Årsak"
        >
            <AutocompleteItem key={"lost_in"}>
                Tapt innmark
            </AutocompleteItem>
            <AutocompleteItem key={"lost_out"}>
                Tapt utmark
            </AutocompleteItem>
            <AutocompleteItem key={"slaught"}>
                Slakt
            </AutocompleteItem>
            <AutocompleteItem key={"slaught_home"}>
                Slakt heime
            </AutocompleteItem>
            <AutocompleteItem key={"euthanized"}>
                Avlivet
            </AutocompleteItem>
            <AutocompleteItem key={"inactive"}>
                Annet
            </AutocompleteItem>
        </Autocomplete>
    )
}