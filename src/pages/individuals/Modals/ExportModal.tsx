// MedicineRegistrationModal.tsx
import {Button, Selection} from '@nextui-org/react';
import {Controller, useForm} from "react-hook-form";
import {Input} from "@nextui-org/input";

import {Individual} from "@/types/types";
import {useAppContext} from "@/context/AppContext";

import {generatePdf} from "@/util/GeneratePDF";
import {yupResolver} from "@hookform/resolvers/yup";
import {exportSchema} from "@/validation/exportValidation";

interface ExportModalProps {
    items: Individual[];
    selectedCols: Selection;
}

interface FormData {
    title: string;
}


const ExportModal = ({items, selectedCols}: ExportModalProps) => {

    const {individuals, breeders} = useAppContext()
    const {handleSubmit, control} = useForm<FormData>({
        resolver: yupResolver(exportSchema)
    });

    const onSubmit = async (data: FormData) => {

        const printable = items.map((ind) => {
            return {
                ...ind,
                mother: individuals.get(ind.mother as string)?.id,
                father: breeders.get(ind.father as string)?.id
            }
        })

        console.log(printable)
        generatePdf(printable, selectedCols, data.title)
    }
    return (

        <form onSubmit={handleSubmit(onSubmit)} className={"grid gap-4"}>
            <Controller
                name="title"
                control={control}
                render={({field, fieldState}) =>
                    <Input label={"Tittel"} {...field} errorMessage={fieldState.error?.message}
                           isRequired/>}
            />

            <Button color={"primary"} type={"submit"} className={"ml-auto"}>
                Eksporter
            </Button>
        </form>
    );
};


export default ExportModal;
