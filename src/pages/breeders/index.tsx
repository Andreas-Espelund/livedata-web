import { useEffect, useState} from "react";

import {
    Button,
    Checkbox,
    Chip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure
} from "@nextui-org/react";

import {Heading1} from "@/components/Headings";
import {Controller, useForm} from "react-hook-form";

import {PlusIcon, VerticalDotsIcon} from "@/images/icons";
import {Breeder} from "@/types/types";
import {addBreeder, updateBreederStatus} from "@/api/firestore";
import {NoticeBox, NoticeWrapper} from "@/components/";
import {useAppContext} from "@/context/AppContext";

export const BreedersPage = () => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const {handleSubmit, control, formState: {isValid}} = useForm({
        mode: 'onChange', // Validate the form on each change
    });


    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failure, setFailure] = useState(false)
    const [showInactive, setShowInactive ] = useState(false)

    const [rows, setRows] = useState<Breeder[]>([])
    const { breeders, user } = useAppContext()

    useEffect(() => {
        let filteredItems = breeders
        if (!showInactive) {
             filteredItems = filteredItems.filter(item => item.status == "active")
        }

        setRows(filteredItems)
    },[showInactive, breeders])


    const onSubmit = async (data) => {
        setLoading(true)
        data["status"] = "active";
        console.log(data)

        await addBreeder(user?.uid, data).then(data => { setSuccess(true) }).catch(error => { setFailure(true) })
        setLoading(false)
    }

    const onStatusChange = async () => {

    }

    const TopContent = () => {
        return (
            <div className={"flex justify-between"}>
                <Heading1>Veirar</Heading1>
                <div className={"flex gap-4"}>
                    <label className={"flex gap-2 items-center"}>
                        Vis inaktive
                        <Checkbox isSelected={showInactive} onValueChange={(v) => setShowInactive(v)}/>
                    </label>
                    <Button startContent={<PlusIcon/>} color={"primary"} onPress={onOpen}>Ny veir</Button>
                </div>
            </div>
        )
    }

    return (
        <div className={"w-full lg:w-4/5 m-auto p-8"}>
            <Table
                isStriped
                aria-label={"bucks"}
                topContentPlacement={"outside"}
                topContent={<TopContent/>}
                bottomContent={<p className={"text-small text-default-400 p-2"}>{`Viser ${rows.length} av ${breeders.length} veirar`}</p>}
                bottomContentPlacement={"outside"}
            >
                <TableHeader>
                    <TableColumn> ID </TableColumn>
                    <TableColumn> KALLENAVN </TableColumn>
                    <TableColumn> FØDSELSDATO </TableColumn>
                    <TableColumn> STATUS </TableColumn>
                    <TableColumn> VALG </TableColumn>
                </TableHeader>
                <TableBody emptyContent={"Ingen veirar registrert"}>
                    {rows.map(e =>
                        <TableRow key={e.id}>
                            <TableCell>{e.id}</TableCell>
                            <TableCell>{e.nickname}</TableCell>
                            <TableCell>{e.birth_date}</TableCell>
                            <TableCell>
                                <Chip color={e.status === "active" ? "success" : "danger"} variant="flat" size={"sm"}>
                                    {e.status === "active" ? "Aktiv" : "Inaktiv"}
                                </Chip>
                            </TableCell>
                            <TableCell width={1}>
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button isIconOnly variant="light">
                                            <VerticalDotsIcon/>
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label={"actions"}>
                                        {e.status === "active" ?
                                            <DropdownItem onPress={() => updateBreederStatus(user?.uid,e.doc, "inactive")}>
                                            Fjern fra aktive veirar
                                            </DropdownItem> :
                                            <DropdownItem onPress={() => updateBreederStatus(user?.uid,e.doc, "active")}>
                                                Legg til aktive veirar
                                            </DropdownItem>
                                        }
                                    </DropdownMenu>
                                </Dropdown>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

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
                                       defaultValue={""}
                                       rules={{required: true}}
                                       render={({field}) =>( <Input {...field} label={"ID (Øremerke)"}/>)}
                                   />

                                   <Controller
                                       control={control}
                                       name={"nickname"}
                                       defaultValue={""}
                                       rules={{required: true}}
                                       render={({field}) =>( <Input {...field} label={"Kallenavn"}/>)}
                                   />

                                   <Controller
                                       control={control}
                                       name={"birth_date"}
                                       defaultValue={""}
                                       rules={{required: true}}
                                       render={({field}) =>( <Input placeholder=" " label="Fødselsdato" {...field} type={"date"} />)}
                                   />



                                   <div className={"flex justify-end gap-4 pb-2"}>
                                       <Button color="danger" variant="light" onPress={onClose}>
                                           Lukk
                                       </Button>
                                       <Button color="primary" type="submit" isLoading={loading}>
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
                {success && <NoticeBox title={"Suksess"} message={"Ny veir lagt til"} type={"success"}/>}
                {failure && <NoticeBox title={"Feil"} message={"Klarte ikkje å legge til ny veir"} type={"danger"}/>}
            </NoticeWrapper>

        </div>
    )
}