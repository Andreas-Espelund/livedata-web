import {Autocomplete, AutocompleteItem, Select, Selection, SelectItem} from "@nextui-org/react";
import React from "react";
import {Simulate} from "react-dom/test-utils";
import change = Simulate.change;


interface BottleSelectorProps {
    field: any,
    fieldState: any,
}
export const BottleSelector = ({field, fieldState}: BottleSelectorProps) => {

    const values = [
        {
            value: "0",
            label: "Nei"
        },
        {
            value: "1",
            label: "Ja"
        },
    ]

    const changeHandler = (selection: Selection) => {
        field.onChange(Array.from(selection)[0])
    }
    console.log(field.value)
    return (
        <Select
            className={"min-w-[100px]"}
            errorMessage={fieldState.error?.message}
            onSelectionChange={changeHandler}
            selectionMode={"single"}
            items={values}
            defaultSelectedKeys={new Set([field.value])}
        >
            {item => <SelectItem key={item.value}>{item.label}</SelectItem>}
        </Select>
    )
}
