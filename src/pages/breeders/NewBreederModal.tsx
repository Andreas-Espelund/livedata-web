import {Button, Input, Modal, ModalBody, ModalContent, ModalHeader} from "@nextui-org/react";
import {Controller, useForm} from "react-hook-form";
import {NoticeBox, NoticeWrapper} from "@/components";
import {yupResolver} from "@hookform/resolvers/yup";
import {breederSchema} from "@/validation/breederValidation";
import useStatus from "@/hooks/useStatus";
import {addBreeder} from "@/api/firestore/breeders";
import {Breeder} from "@/types/types";

interface BreederFormData {
    id: string;
    nickname: string;
    birth_date: string;
}

interface NewBreederModalProps {
    isOpen: boolean;
    onOpenChange: () => void;

}

const NewBreederModal = ({isOpen, onOpenChange}: NewBreederModalProps) => {

    const {handleSubmit, control, formState: {isValid}, reset} = useForm<BreederFormData>({
        resolver: yupResolver(breederSchema)
    });


    const {loading, error, success, startLoading, setSuccessState, setErrorState, resetStatus} = useStatus()


    const onSubmit = async (data: BreederFormData) => {
        startLoading()
        addBreeder({...data, status: "active"} as Breeder)
            .then(setSuccessState)
            .catch(setErrorState)
            .finally(() => {
                reset();
                onOpenChange();
            })
    }

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Registrer ny veir</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit(onSubmit)} className={"grid gap-6"}>
                                    <Controller
                                        control={control}
                                        name={"id"}
                                        render={({field}) => (<Input {...field} label={"ID (Øremerke)"}/>)}
                                    />

                                    <Controller
                                        control={control}
                                        name={"nickname"}
                                        render={({field}) => (<Input {...field} label={"Kallenavn"}/>)}
                                    />

                                    <Controller
                                        control={control}
                                        name={"birth_date"}
                                        render={({field}) => (
                                            <Input placeholder=" " label="Fødselsdato" {...field} type={"date"}/>)}
                                    />


                                    <div className={"flex justify-end gap-4 pb-2"}>
                                        <Button color="danger" variant="light" onPress={onClose}>
                                            Lukk
                                        </Button>
                                        <Button color="primary" type="submit" isLoading={loading} isDisabled={!isValid}>
                                            Registrer
                                        </Button>
                                    </div>
                                </form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <NoticeWrapper>
                <NoticeBox title={"Suksess"} message={"Ny veir lagt til"} type={"success"} visible={success}
                           onClose={resetStatus}/>
                <NoticeBox title={"Feil"} message={error?.message || "Noko gjekk gale"} type={"danger"}
                           visible={error !== null}
                           onClose={resetStatus}/>
            </NoticeWrapper>
        </>
    )
}

export default NewBreederModal;