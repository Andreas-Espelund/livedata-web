import {useMemo, useState} from "react";

import {
    Button,
    Checkbox,
    Chip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure
} from "@nextui-org/react";

import {Heading1} from "@/components/Headings";

import {PlusIcon, VerticalDotsIcon} from "@/images/icons";
import {updateBreederStatus} from "@/api/firestore/breeders";
import {useAppContext} from "@/context/AppContext";
import NewBreederModal from "@/pages/breeders/NewBreederModal";


export const BreedersPage = () => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const {breeders} = useAppContext()
    const [showInactive, setShowInactive] = useState(false)

    const breederList = Array.from(breeders.values())

    const filteredItems = useMemo(() => {
        return showInactive ? breederList : breederList.filter(item => item.status === "active")
    }, [showInactive, breederList])


    const TopContent = () => {
        return (
            <div className={"flex justify-between"}>
                <Heading1>Veirar</Heading1>
                <div className={"flex gap-4"}>
                    <label className={"flex gap-2 items-center"}>
                        Vis inaktive
                        <Checkbox isSelected={showInactive} onValueChange={(v) => setShowInactive(v)}/>
                    </label>
                    <Button startContent={<PlusIcon/>} color={"primary"} variant={"shadow"} onPress={onOpen}>Ny
                        veir</Button>
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
                bottomContent={<p
                    className={"text-small text-default-400 p-2"}>{`Viser ${filteredItems.length} av ${breederList.length} veirar`}</p>}
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
                    {filteredItems.map(e =>
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
                                            <DropdownItem
                                                onPress={() => updateBreederStatus(e.doc, "inactive")}>
                                                Fjern fra aktive veirar
                                            </DropdownItem> :
                                            <DropdownItem
                                                onPress={() => updateBreederStatus(e.doc, "active")}>
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

            <NewBreederModal isOpen={isOpen} onOpenChange={onOpenChange}/>
        </div>
    )
}