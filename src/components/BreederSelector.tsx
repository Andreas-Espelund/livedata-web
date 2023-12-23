import React, {useContext} from "react";
import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import {Context} from "@/App";


export const BreederSelector = ({label, field}: {
    label: string | undefined,
    field: any,
}) => {

    const {breeders} = useContext(Context)
    return (
        <Autocomplete
            label={label || "Velg et individ"}
            placeholder={label ? "Velg et individ" : ""}
            value={field?.value}
            onSelectionChange={(e) => field.onChange(e)}
        >
            {breeders.map(item =>
                <AutocompleteItem
                    key={item.id}
                    textValue={`${item.nickname} (${item.tag})`}
                >
                    <div>
                        <p className={"text-md font-semibold"}>{item.nickname}</p>
                        <p className={"text-sm"}>{item.tag}</p>
                    </div>
                </AutocompleteItem>
            )}
        </Autocomplete>
    )
}