import React, {useContext} from "react";
import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import {Context} from "@/App";
import {useAppContext} from "@/context/AppContext";


export const BreederSelector = ({label, field, fieldState}: {
    label: string | undefined,
    field: any,
    fieldState: any,
}) => {

    const {breeders} = useAppContext()
    return (
        <Autocomplete
            label={label || "Velg et individ"}
            placeholder={label ? "Velg et individ" : ""}
            value={field?.value}
            onSelectionChange={(e) => field.onChange(e)}
            errorMessage={fieldState?.error?.message}
        >
            {breeders.filter(e => e.status === "active").map(item =>
                <AutocompleteItem
                    key={item.doc}
                    textValue={`${item.nickname} (${item.id})`}
                >
                    <div>
                        <p className={"text-md font-semibold"}>{item.nickname}</p>
                        <p className={"text-sm"}>{item.id}</p>
                    </div>
                </AutocompleteItem>
            )}
        </Autocomplete>
    )
}