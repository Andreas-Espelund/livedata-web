// MedicineRegistrationModal.tsx
import React, {useContext, useState} from 'react';
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    Progress, Selection
} from '@nextui-org/react';
import {Controller, useForm} from "react-hook-form";
import {Input} from "@nextui-org/input";

import {ChevronDownIcon} from "@/images/icons";
import {formatDate} from "@/util/utils";
import {Individual} from "@/types/types";
import {addMedicineRecord} from "@/api/firestore";

import {useAppContext} from "@/context/AppContext";

import {
    Row,
    Stack,
    NoticeWrapper,
    NoticeBox
} from '@/components'
import {generatePdf} from "@/util/GeneratePDF";

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    toPrint: Individual[];
    columns: Selection;
}

interface FormData {
    title: string;
}


const ExportModal = ({isOpen, onClose, toPrint, columns}: ExportModalProps) => {

    const {individuals, breeders} = useAppContext()
    const {handleSubmit, control, reset} = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        console.log(individuals)
        const printable = toPrint.map((ind) => {
            return {
                ...ind,
                mother: individuals.get(ind.mother as string)?.id,
                father: breeders.get(ind.father as string)?.id
            }
        })

        console.log(printable)
        generatePdf(printable, columns, data.title)
    }


    const closeHandler = () => {
        reset()
        onClose()
    }

    return (

        <Modal isOpen={isOpen} onClose={closeHandler} isDismissable={false}>
            <ModalContent>
                <ModalHeader>
                    Skriv ut liste
                </ModalHeader>
                <ModalBody>

                    <form onSubmit={handleSubmit(onSubmit)} className={"grid gap-4"}>
                        <Controller
                            name="title"
                            control={control}
                            rules={{required: "Skriv tittel"}}
                            render={({field, fieldState}) =>
                                <Input label={"Tittel"} {...field} errorMessage={fieldState.error?.message}
                                       isRequired/>}
                        />

                        <Button color={"primary"} type={"submit"} className={"ml-auto"}>
                            Eksporter
                        </Button>

                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};


export default ExportModal;
