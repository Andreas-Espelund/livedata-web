import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import {Key} from "react";


interface DeactivationSelectorProps {
    value: string
    onChange: (e: Key) => void
    errorMessage?: string | undefined

}

export const DeactivationSelector = ({value, onChange, errorMessage}: DeactivationSelectorProps) => {
    return (
        <Autocomplete
            value={value}
            onSelectionChange={onChange}
            defaultSelectedKey={value}
            label="Årsak"
            errorMessage={errorMessage}
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