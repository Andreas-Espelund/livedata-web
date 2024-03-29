import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import {useAppContext} from "@/context/AppContext";
import {Key, useMemo} from "react";

interface BreederSelectorProps {
    label: string | undefined,
    value: string | null | undefined,
    onChange: (e: Key) => void,
    errorMessage?: string | undefined
}

export const BreederSelector = ({label, value, onChange, errorMessage}: BreederSelectorProps) => {
    const {breeders} = useAppContext()
    const selectable = useMemo(() => Array.from(breeders.values()), [breeders])
    return (
        <Autocomplete
            label={label || "Velg et individ"}
            placeholder={label ? "Velg et individ" : ""}
            value={value ? value : ""}
            onSelectionChange={onChange}
            errorMessage={errorMessage}
        >
            {selectable.filter(e => e.status === "active").map(item =>
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