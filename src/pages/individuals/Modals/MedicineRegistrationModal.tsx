// MedicineRegistrationModal.tsx
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from '@nextui-org/react';
import {Controller, useForm} from "react-hook-form";
import {Input} from "@nextui-org/input";

import {ChevronDownIcon} from "@/images/icons";
import {formatDate} from "@/util/utils";
import {Individual} from "@/types/types";
import {addMedicineRecord} from "@/api/firestore/registrations";

import {
    NoticeWrapper,
    NoticeBox
} from '@/components'
import useStatus from "@/hooks/useStatus";
import {massMedicineSchema} from "@/validation/massMedicineValidation";
import {yupResolver} from "@hookform/resolvers/yup";
import {MedicineSelector} from "@/components/MedicineSelector";

interface MassMedicineProps {
    items: Individual[];
}

interface MassMedicineFormData {
    date: string;
    medicine: string;
}


const MassMedicine = ({items}: MassMedicineProps) => {
    const {loading, error, success, startLoading, setErrorState, setSuccessState, resetStatus} = useStatus()

    const {handleSubmit, control} = useForm<MassMedicineFormData>({
        resolver: yupResolver(massMedicineSchema),
        defaultValues: {
            date: formatDate(new Date()),
        }
    });

    const onSubmit = async (data: MassMedicineFormData) => {
        startLoading()

        const promises = items.map(e => addMedicineRecord({...data, individual: e.doc}))

        await Promise.all(promises)
            .then(setSuccessState)
            .catch(setErrorState)
    }

    return (
        <>
            <form id="registrationForm" onSubmit={handleSubmit(onSubmit)} className={"flex flex-col gap-4"}>
                <Dropdown>
                    <DropdownTrigger>
                        <Button variant="light" color={"primary"} endContent={<ChevronDownIcon/>} className={"w-min"}>
                            {`Påvirker ${items.length}  ${items.length == 1 ? 'individ' : 'individer'}`}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions"
                                  className={"max-h-[30vh] overflow-y-scroll scrollbar-hide"}>
                        {items.map((item) =>
                            <DropdownItem key={item.doc}> {item.id} </DropdownItem>
                        )}
                    </DropdownMenu>
                </Dropdown>
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
                <Button isLoading={loading} form="registrationForm" color={"primary"} type={"submit"}
                        className={"ml-auto"}>
                    Registrer
                </Button>
            </form>

            <NoticeWrapper>
                <NoticeBox title={"Noko gjekk gale"} message={"Kunne ikkje registrere medisinering"} type={"danger"}
                           visible={error !== null} onClose={() => resetStatus()}/>
                <NoticeBox title={"Suksess"} message={"Medisinering registrert"} type={"success"}
                           visible={success} onClose={() => resetStatus()}/>
            </NoticeWrapper>
        </>
    );
};


export default MassMedicine;
