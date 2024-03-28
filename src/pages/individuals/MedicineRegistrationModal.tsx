// MedicineRegistrationModal.tsx
import React, {useMemo, useState} from 'react';
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
import {addMedicineRecord} from "@/api/firestore/registrations";

import {useAppContext} from "@/context/AppContext";

import {
    Row,
    Stack,
    NoticeWrapper,
    NoticeBox
} from '@/components'
import useStatus from "@/hooks/useStatus";
import {massMedicineSchema} from "@/validation/massMedicineValidation";
import {yupResolver} from "@hookform/resolvers/yup";
import {MedicineSelector} from "@/components/MedicineSelector";

interface MedicineRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedKeys: Selection;
    individuals: Individual[];
}

interface MedicineRegistrationFormData {
    date: string;
    medicine: string;
}


const MedicineRegistrationModal = ({isOpen, onClose, selectedKeys, individuals}: MedicineRegistrationModalProps) => {
    const {user} = useAppContext()
    const {loading, error, success, startLoading, setErrorState, setSuccessState, resetStatus} = useStatus()

    const [value, setValue] = useState(0)

    const {handleSubmit, control, reset} = useForm<MedicineRegistrationFormData>({
        resolver: yupResolver(massMedicineSchema),
        defaultValues: {
            date: formatDate(new Date()),
        }
    });

    // useMemo to only recompute when individuals or selectedKeys changes
    const selectedIndividuals = useMemo(() => {
        if (selectedKeys === "all") {
            return individuals;
        } else {
            const keys = Array.from(selectedKeys); // Adjust based on how you can obtain the keys from selectedKeys
            return individuals.filter((individual) => keys.includes(individual.id));
        }
    }, [individuals, selectedKeys]);


    const onSubmit = async (data) => {
        if (!user) return;
        startLoading()
        selectedIndividuals.forEach(e => console.log(e.doc))

        try {
            const promises = selectedIndividuals.map(e => addMedicineRecord(user.authUser?.uid, {
                ...data,
                individual: e.doc
            }))
            for (const e of promises) {
                await e
                setValue(i => i + 1)
            }
            setSuccessState()
        } catch (error) {
            console.error(error)
            setErrorState(error)
        }
    }


    const closeHandler = () => {
        setValue(0)
        reset()
        resetStatus()
        onClose()
    }

    return (

        <Modal isOpen={isOpen} onClose={closeHandler} isDismissable={false}>
            <ModalContent>
                <ModalHeader> Ny Medisinering </ModalHeader>
                <ModalBody>
                    <Row>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button variant="bordered" endContent={<ChevronDownIcon/>}>
                                    {`Påvirker ${selectedIndividuals.length}  ${selectedIndividuals.length == 1 ? 'individ' : 'individer'}`}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Static Actions">
                                {selectedIndividuals.map((item) =>
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
                                render={({field, fieldState}) =>
                                    <Input label={"Dato"} type="date" {...field}
                                           errorMessage={fieldState.error?.message}/>}
                            />
                            <Controller
                                name="medicine"
                                control={control}
                                render={({field, fieldState}) =>
                                    <MedicineSelector field={field} errorMessage={fieldState.error?.message}/>}
                            />

                            <div className={"flex justify-between items-center gap-4 w-full"}>
                                {loading || error || success &&
                                    <Progress
                                        aria-label="Registering"
                                        size="md"
                                        value={value}
                                        maxValue={selectedIndividuals.length}
                                        color={error ? "danger" : "success"}
                                        showValueLabel={true}
                                        className="max-w-md pb-2"
                                    />
                                }
                                <Button isLoading={loading} form="registrationForm" color={"primary"} type={"submit"}
                                        className={"ml-auto"}>
                                    Registrer
                                </Button>
                            </div>
                        </Stack>
                    </form>
                </ModalBody>
            </ModalContent>

            <NoticeWrapper>
                <NoticeBox title={"Noko gjekk gale"} message={"Kunne ikkje registrere medisinering"} type={"danger"}
                           visible={error !== null} onClose={() => resetStatus()}/>
                <NoticeBox title={"Suksess"} message={"Medisinering registrert"} type={"success"}
                           visible={success} onClose={() => resetStatus()}/>
            </NoticeWrapper>
        </Modal>
    );
};


export default MedicineRegistrationModal;
