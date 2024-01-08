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
    ModalFooter,
    ModalHeader, Progress, user
} from '@nextui-org/react';
import {Controller, useForm} from "react-hook-form";
import {Input} from "@nextui-org/input";
import {Row, Stack} from "@/components/Layout";
import Message from "@/components/Message";
import {formatDate} from "@/api/utils";
import {Individual} from "@/types/types";
import {addMedicineRecord, addNoteRecord} from "@/api/firestore";
import {Context} from "@/App";
import NoticeWrapper from "@/components/NoticeWrapper";
import {NoticeBox} from "@/components/NoticeBox";
import {ChevronDownIcon} from "@/images/icons";

interface MedicineRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedRows: Individual[];
}

function validateDate(date: string): string | undefined {
    if (!date) {
        return 'Date is required';
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        return 'Invalid date';
    }

    return undefined; // No errors if date is valid
}


const MedicineRegistrationModal = ({isOpen, onClose, selectedRows}: MedicineRegistrationModalProps) => {
    const {user} = useContext(Context)
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [value, setValue] = useState(0)

    const {register, handleSubmit, control, reset} = useForm({
        defaultValues: {
            date: formatDate(new Date()),
            medicine: "",
        }
    });

    const onSubmit = async (data) => {
        if (!user) return;
        setLoading(true)

        console.log('registering medicine')
        console.log(data.date)
        console.log(data.medicine)
        selectedRows.forEach(e => console.log(e.doc))

        try {
            const promises = selectedRows.map(e => addMedicineRecord(user.uid, {...data, individual: e.doc }))
            promises.forEach(async e => {
                await e
                setValue(i => i+1)
            })
            setSuccess(true)
        } catch (error) {
            console.error(error)
            setError(true)
        } finally {
            setLoading(false)
        }
    }


    const closeHandler = () => {
        setValue(0)
        reset()
        setSuccess(false)
        setLoading(false)
        setError(false)
        onClose()
    }

    return (

        <Modal isOpen={isOpen} onClose={closeHandler} isDismissable={false}>
            <ModalContent>
                <ModalHeader>
                    Ny Medisinering
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button variant="bordered" endContent={<ChevronDownIcon/>}>
                                    {`Påvirker ${selectedRows.length}  ${selectedRows.length == 1 ? 'individ' : 'individer'}`}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Static Actions">
                                {selectedRows.map((item) =>
                                    <DropdownItem key={item.doc}> {item.id} </DropdownItem>
                                )}
                            </DropdownMenu>
                        </Dropdown>
                    </Row>
                    <form id="registrationForm" onSubmit={handleSubmit(onSubmit)}>
                        <Stack>
                            <Controller
                                name="date"
                                control={control}
                                rules={{required: "Velg dato"}}
                                render={({field, fieldState}) =>
                                    <Input label={"Dato"} type="date" {...field} errorMessage={fieldState.error?.message}/>}
                            />
                            <Controller
                                name="medicine"
                                control={control}
                                rules={{required: "Skriv navn på medisin"}}
                                render={({field, fieldState}) =>
                                    <Input label={"medisin"} {...field} errorMessage={fieldState.error?.message}/>}
                            />

                            <div className={"flex justify-between items-center gap-4 w-full"}>
                                {isLoading || error || success &&
                                    <Progress
                                        aria-label="Registering"
                                        size="md"
                                        value={value}
                                        maxValue={selectedRows.length}
                                        color={error ? "danger" : "success"}
                                        showValueLabel={true}
                                        className="max-w-md pb-2"
                                    />
                                }
                                <Button isLoading={isLoading} form="registrationForm" color={"primary"} type={"submit"} className={"ml-auto"}>
                                    Registrer
                                </Button>
                            </div>
                        </Stack>
                    </form>
                </ModalBody>
            </ModalContent>

            <NoticeWrapper>
                {error && <NoticeBox title={"Noko gjekk gale"} message={"Kunne ikkje registrere medisinering"} type={"danger"} noTimeout={false}/>}
                {success && <NoticeBox title={"Suksess"} message={"Medisinering registrert"} type={"success"} noTimeout={false}/>}
            </NoticeWrapper>
        </Modal>
    );
};




export default MedicineRegistrationModal;
