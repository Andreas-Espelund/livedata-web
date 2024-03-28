import {Autocomplete, AutocompleteItem, Select, Selection, SelectItem} from "@nextui-org/react";
import React from "react";
import {Simulate} from "react-dom/test-utils";
import change = Simulate.change;


interface GenderSelectorProps {
    field: any,
    fieldState: any,
}

export const GenderSelector = ({field, fieldState}: GenderSelectorProps) => {

    const genders = [
        {
            value: "female",
            label: "Søye"
        },
        {
            value: "male",
            label: "Veir"
        },
    ]


    const changeHandler = (selection: Selection) => {
        field.onChange(Array.from(selection)[0])

    }
    return (
        <Select
            label={"Kjønn"}
            className={"min-w-[100px]"}
            value={field.value}
            errorMessage={fieldState.error?.message}
            onSelectionChange={changeHandler}
            selectionMode={"single"}
            items={genders}
        >
            {item => <SelectItem key={item.value}>{item.label}</SelectItem>}
        </Select>
    )
}
