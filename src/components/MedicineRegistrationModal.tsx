// MedicineRegistrationModal.tsx
import React, {useState} from 'react';
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
    ModalHeader
} from '@nextui-org/react';
import {Controller, useForm} from "react-hook-form";
import {Input} from "@nextui-org/input";
import {Row, Stack} from "@/components/Layout";
import Message from "@/components/Message";

interface MedicineRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedRows: string[];
}

interface RegistrationFormData {
    date: string;
    medicineType: string;
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


const MedicineRegistrationModal: React.FC<MedicineRegistrationModalProps> = (
    {
        isOpen,
        onClose,
        selectedRows,
    }
) => {

    const {register, handleSubmit, errors, control} = useForm<RegistrationFormData>();


    function sleep(seconds) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }


    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmittingError, setIsSubmittingError] = useState(false);
    const [isSubmittingSuccess, setIsSubmittingSuccess] = useState(false);
    const handleRegistration = async (formData: RegistrationFormData) => {
        const registrationPayload = {
            type: formData.medicineType,
            date: formData.date,
            items: selectedRows,
        };
        setIsSubmitting(true)

        await sleep(2)

        try {
            const response = await fetch('/register/medicine', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationPayload),
            });

            if (response.ok) {
                console.log('Registration successful');

            } else {
                console.error('Registration failed');
            }
            setIsSubmitting(false)
            setIsSubmittingSuccess(true)
        } catch (error) {
            console.error('An error occurred while registering:', error);
            setIsSubmitting(false)
            //setIsSubmittingError(true)
            setIsSubmittingSuccess(true)
        }

        // You can perform the actual registration here
    };

    return (

        <Modal isOpen={isOpen} onClose={onClose}>

            <ModalContent>
                <ModalHeader>
                    Ny Medisinering
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button
                                    variant="bordered"
                                >
                                    {`Påvirker ${selectedRows.length}  ${selectedRows.length == 1 ? 'individ' : 'individer'}`}
                                    <ChevronDownIcon/>
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Static Actions">
                                {
                                    selectedRows.map((item) => (
                                        <DropdownItem key={item}>
                                            {item}
                                        </DropdownItem>
                                    ))
                                }
                            </DropdownMenu>
                        </Dropdown>
                    </Row>
                    <form id="registrationForm">
                        <Stack>
                            <label>Dato:</label>
                            <Controller
                                name="date"
                                control={control}
                                rules={{required: true}}
                                render={({field}) => <Input type="date" {...field}/>}
                            />
                            {/*{errors.date && <p>Date is required</p>}*/}
                            <label>Medisin:</label>
                            <Controller
                                name="medicineType"
                                control={control}
                                rules={{required: true}}
                                render={({field}) => <Input {...field} />}
                            />
                            {/*{errors.medicineType && <p>Medicine Type is required</p>}*/}
                        </Stack>
                    </form>
                    {isSubmittingError &&
                        <Message text={"En feil oppstod ved registrering"} variant={"Error"}
                                 onClose={() => setIsSubmittingError(false)}/>
                    }
                    {isSubmittingSuccess &&
                        <Message text={"Registrering fullført"} variant={"Success"}
                                 onClose={() => setIsSubmittingSuccess(false)}/>
                    }
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClose} color={"danger"} variant={"bordered"}>
                        Avbryt
                    </Button>
                    <Button isLoading={isSubmitting} form="registrationForm" color={"primary"}
                            onClick={handleSubmit(handleRegistration)}>
                        Registrer
                    </Button>

                </ModalFooter>
            </ModalContent>

        </Modal>
    );
};

export const ChevronDownIcon = () => (
    <svg fill="none" height="14" viewBox="0 0 24 24" width="14" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M17.9188 8.17969H11.6888H6.07877C5.11877 8.17969 4.63877 9.33969 5.31877 10.0197L10.4988 15.1997C11.3288 16.0297 12.6788 16.0297 13.5088 15.1997L15.4788 13.2297L18.6888 10.0197C19.3588 9.33969 18.8788 8.17969 17.9188 8.17969Z"
            fill="currentColor"/>
    </svg>
);


export default MedicineRegistrationModal;
