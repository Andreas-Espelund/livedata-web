import {
    Button,
    Table,
    TableBody,
    TableCell, TableColumn,
    TableHeader,
    TableRow, useDisclosure
} from "@nextui-org/react";
import {Heading2} from "@/components/";
import {useAppContext} from "@/context/AppContext";
import React, {useMemo} from "react";
import MedicineRegistryModal from "@/pages/settings/tabs/MedicineRegistryModal";
import {deleteMedicineRegistry} from "@/api/firestore/medicineRegistry";


const MedicineRegistry = () => {

    const {isOpen, onClose, onOpenChange} = useDisclosure()
    const {medicines, user} = useAppContext()


    const deleteMedicine = (name: string) => {
        console.log("Deleting medicine", name)
        deleteMedicineRegistry(user?.authUser?.uid || "", name)
            .then(() => console.log("Deleted medicine", name))
    }

    const topContent = useMemo(() => {

        return (
            <div className={"flex justify-between"}>
                <Heading2>Medisinregister</Heading2>
                <Button size={"lg"} color={"primary"} variant={"shadow"} onPress={onOpenChange}>
                    Ny medisin
                </Button>
            </div>
        )
    }, [medicines])

    return (
        <>
            <Table topContent={topContent}>
                <TableHeader>
                    <TableColumn>
                        Navn
                    </TableColumn>
                    <TableColumn className={"text-right"}>
                        Handlinger
                    </TableColumn>
                </TableHeader>
                <TableBody>
                    {
                        medicines.map((medicine, index) =>
                            <TableRow key={index}>
                                <TableCell>{medicine.name}</TableCell>
                                <TableCell className={"flex gap-4 justify-end"}>
                                    <Button size={"sm"} color={"danger"} variant={"light"}
                                            onClick={() => deleteMedicine(medicine.name)}>Slett</Button>
                                </TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>

            <MedicineRegistryModal isOpen={isOpen} onClose={onClose}/>
        </>
    )
}

export default MedicineRegistry;