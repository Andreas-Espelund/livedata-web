import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import {useAppContext} from "@/context/AppContext";

interface MedicineSelectorProps {
    field: any;
    errorMessage?: string;
}

export const MedicineSelector = ({field, errorMessage}: MedicineSelectorProps) => {

    const {medicines} = useAppContext()

    const empty = medicines.length === 0
    return (
        <Autocomplete
            label={empty ? "Legg til medisiner i innstillinger!" : "Velg medisin"}
            color={empty ? "danger" : "default"}
            onSelectionChange={field.onChange}
            errorMessage={errorMessage}
            isDisabled={empty}
        >
            {medicines.map(item =>
                <AutocompleteItem
                    textValue={item.name}
                    key={item.name}
                >
                    {item.name}
                </AutocompleteItem>
            )}
        </Autocomplete>
    )
}