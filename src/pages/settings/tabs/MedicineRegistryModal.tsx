import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from '@nextui-org/react';
import {Controller, useForm} from "react-hook-form";
import {Input} from "@nextui-org/input";

import {
    NoticeWrapper,
    NoticeBox
} from '@/components'
import {addMedicineRegistry} from "@/api/firestore/medicineRegistry";
import useStatus from "@/hooks/useStatus";


interface MedicineRegistryData {
    medicine: string;
}

interface MedicineRegistryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const MedicineRegistryModal = ({isOpen, onClose}: MedicineRegistryModalProps) => {

    const {loading, error, success, startLoading, setSuccessState, setErrorState, resetStatus} = useStatus();
    const {control, handleSubmit} = useForm<MedicineRegistryData>({
        defaultValues: {
            medicine: ""
        }
    });


    const onSubmit = async (data: MedicineRegistryData) => {
        console.log(data)
        startLoading()
        await addMedicineRegistry(data.medicine)
            .then(setSuccessState)
            .catch(setErrorState)
    }

    return (
        <>

            <Modal isOpen={isOpen} onClose={onClose} isDismissable={false}>
                <ModalContent>
                    <ModalHeader>
                        Registrer ny medisin
                    </ModalHeader>
                    <ModalBody>
                        <form action="" onSubmit={handleSubmit(onSubmit)}>
                            <div className={"flex flex-col gap-4 items-center justify-center mb-2"}>
                                <Controller
                                    control={control}
                                    name={"medicine"}
                                    render={({field, fieldState}) =>
                                        <Input
                                            {...field}
                                            isRequired
                                            errorMessage={fieldState.error?.message}
                                            label={"Skriv navn på medisin"}
                                        />
                                    }/>

                                <div className={"flex gap-2 justify-end w-full"}>
                                    <Button color={"danger"} variant={"bordered"} onPress={onClose}>
                                        Avbryt
                                    </Button>
                                    <Button color={"primary"} type={"submit"}
                                            isLoading={loading}>
                                        Ok
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>

            <NoticeWrapper>
                <NoticeBox title={"Suksess"} message={"Medisin lagt til"} type={"success"} visible={success}
                           onClose={resetStatus}/>
                <NoticeBox title={"Feil"} message={"Kunne ikkje legge til medisin"} type={"danger"}
                           visible={error !== null} onClose={resetStatus}/>
            </NoticeWrapper>
        </>
    );
};


export default MedicineRegistryModal;
