import {Individual} from "@/types/types";
import {DeactivationSelector, NoticeBox, NoticeWrapper} from "@/components";
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Textarea} from "@nextui-org/react";
import {ChevronDownIcon} from "@/images/icons";
import {Controller, useForm} from "react-hook-form";
import {Input} from "@nextui-org/input";
import useStatus from "@/hooks/useStatus";
import {yupResolver} from "@hookform/resolvers/yup";

import {formatDate} from "@/util/utils";
import {massDeactivationSchema} from "@/validation/massDeactivationValidation";

import {updateIndividualStatus} from "@/api/firestore/individuals";


interface MassDeactivationFormData {
    date: string;
    status: string;
    note?: string;

}

interface MassDeactivationProps {
    items: Individual[];
}

const MassDeactivation = ({items}: MassDeactivationProps) => {
    const {loading, error, success, startLoading, setErrorState, setSuccessState, resetStatus} = useStatus()

    const {handleSubmit, control} = useForm<MassDeactivationFormData>({
        resolver: yupResolver(massDeactivationSchema),
        defaultValues: {
            date: formatDate(new Date()),
            status: "slaught",
        }
    });

    const onSubmit = async (data: MassDeactivationFormData) => {
        startLoading()
        const promises = items.map(e =>
            updateIndividualStatus({...data, individual: e.doc, note: data.note || ""})
        )

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
                    name="status"
                    control={control}
                    render={({field, fieldState}) =>
                        <DeactivationSelector {...field} errorMessage={fieldState.error?.message}/>}
                />

                <Controller
                    name="note"
                    control={control}
                    render={({field}) => (
                        <Textarea {...field} placeholder="Skriv inn notat" rows={4}/>
                    )}
                />

                <div className={"flex justify-between items-center gap-4 w-full"}>
                    <Button isLoading={loading} form="registrationForm" color={"primary"} type={"submit"}
                            className={"ml-auto"}>
                        Bekreft
                    </Button>
                </div>

            </form>

            <NoticeWrapper>
                <NoticeBox title={"Noko gjekk gale"} message={"Kunne ikkje registrere utmelding"} type={"danger"}
                           visible={error !== null} onClose={() => resetStatus()}/>
                <NoticeBox title={"Suksess"} message={"Utmelding registrert"} type={"success"}
                           visible={success} onClose={() => resetStatus()}/>
            </NoticeWrapper>
        </>
    )
}

export default MassDeactivation;