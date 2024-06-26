import React, {useEffect, useMemo} from "react";
import {
    Button, ButtonGroup,
    Chip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input, Modal, ModalBody, ModalContent, ModalHeader,
    Pagination,
    Selection,
    Slider,
    SortDescriptor,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow, Tooltip, useDisclosure
} from "@nextui-org/react";

import {SearchIcon, VerticalDotsIcon} from "../../../public/icons";
import {Individual} from "@/types/types";
import {Heading1} from "@/components/Headings";
import {useAppContext} from "@/context/AppContext";
import {NavLink} from "react-router-dom";

import ExportModal from "@/pages/individuals/Modals/ExportModal";
import {BoltIcon, HeartIcon, PrinterIcon, WarningIcon} from "@/images/icons";
import MassDeactivation from "@/pages/individuals/Modals/MassDeactivation";
import MassMedicine from "@/pages/individuals/Modals/MedicineRegistrationModal";
import QuickActions from "@/components/QuickActions";


const columns = [
    {name: "ID (ØREMERKE)", uid: "id", sortable: true},
    {name: "KJØNN", uid: "gender", sortable: true},
    {name: "MOR", uid: "mother", sortable: true},
    {name: "STATUS", uid: "status", sortable: true},
    {name: "FAR", uid: "father", sortable: true},
    {name: "KOPP", uid: "bottle", sortable: true},
    {name: "FØDT DATO", uid: "birth_date", sortable: true},
    {name: "VALG", uid: "actions"},
];

export const statusMap = {
    "active": "Aktiv",
    "lost_in": "Tapt innmark",
    "lost_out": "Tapt utmark",
    "slaught": "Slakt",
    "slaught_home": "Slakt heime",
    "euthanized": "Avlivet",
    "inactive": "Inaktiv"
}
const capitalize = (str: string) => {
    return str.toUpperCase()
}

const DEFAULTS: Record<string, string[] | number[] | number> = {
    "columns": ["id", "birth_date", "status", "father", "mother", "gender", "actions", "bottle"],
    "status": ["active"],
    "genders": ["male", "female"],
    "year": [2024 - 5, 2024],
    "pages": 10
}


// Function to get value from local storage or return default
const get_local_or_default_value = (key: string): string | [] | number => {
    const storedItem = localStorage.getItem(key);

    return storedItem !== null ? JSON.parse(storedItem) : DEFAULTS[key]

};


export const IndividualsPage = () => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const {individuals, breeders} = useAppContext()

    const [selectedModal, setSelectedModal] = React.useState<string>("")
    const currentYear = new Date().getFullYear()
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(get_local_or_default_value("columns") as string[]));
    const [genderFilter, setGenderFilter] = React.useState<Selection>(new Set(get_local_or_default_value("genders") as string[]));
    const [activeFilter, setActiveFilter] = React.useState<Selection>(new Set(get_local_or_default_value("status") as string[]));
    const [rowsPerPage, setRowsPerPage] = React.useState<number>(get_local_or_default_value("pages") as number);
    const [page, setPage] = React.useState(1);
    const [ageFilter, setAgeFilter] = React.useState<number[] | number>(get_local_or_default_value("year") as number[])
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "tag",
        direction: "ascending",
    });


    // updating local browser storage
    useEffect(() => {
        localStorage.setItem('columns', JSON.stringify(Array.from(visibleColumns)));
    }, [visibleColumns]);

    useEffect(() => {
        localStorage.setItem('status', JSON.stringify(Array.from(activeFilter)));
    }, [activeFilter]);

    useEffect(() => {
        localStorage.setItem('genders', JSON.stringify(Array.from(genderFilter)));
    }, [genderFilter]);

    useEffect(() => {
        localStorage.setItem("year", JSON.stringify(ageFilter))
    }, [ageFilter]);

    useEffect(() => {
        localStorage.setItem("pages", JSON.stringify(rowsPerPage))
    }, [rowsPerPage]);


    const handleModalChange = (selectedModalType: Selection) => {
        const selectedModal = Array.from(selectedModalType)[0].toString()
        setSelectedModal(selectedModal)
        onOpen()
    }

    const clearFilterData = () => {
        setAgeFilter(DEFAULTS["year"] as number[])
        setVisibleColumns(new Set(DEFAULTS["columns"] as string[]))
        setGenderFilter(new Set(DEFAULTS["genders"] as string[]))
        setActiveFilter(new Set(DEFAULTS["status"] as string[]))
    }

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);


    /*
    * Filtering and sorting function
    * */
    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = React.useMemo(() => {
        let filtered = Array.from(individuals.values());

        // apply search filter
        if (hasSearchFilter) {
            filtered = filtered.filter((user) =>
                user.id.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }

        // apply gender filter
        const genders = Array.from(genderFilter)
        if (genders.length == 1) {
            filtered = filtered.filter((ind) => ind.gender === genders[0])
        }

        // apply age filter
        const range = Array.isArray(ageFilter) ? ageFilter : [ageFilter, ageFilter]
        filtered = filtered.filter(ind => {
            let year = Number(ind.birth_date.slice(0, 4))
            if (year < 1) year = currentYear
            return year >= range[0] && year <= range[1]
        })

        // apply status filter
        const statuses = Array.from(activeFilter)
        if (statuses.length == 1) {
            if (statuses[0] == "active") {
                filtered = filtered.filter(ind => statuses[0] === ind.status)
            } else {
                filtered = filtered.filter(ind => "active" !== ind.status)
            }
        }

        return filtered;
    }, [individuals, hasSearchFilter, genderFilter, ageFilter, activeFilter, filterValue, currentYear]);

    const selectedFilteredItems: Individual[] = useMemo(() => {
        if (selectedKeys === "all") return filteredItems;
        const keys = Array.from(selectedKeys);
        return filteredItems.filter((ind) => keys.includes(ind.doc))
    }, [selectedKeys, filteredItems])


    /*
    * Sorting and pagination
    * */

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a: Individual, b: Individual) => {
            const first = a[sortDescriptor.column as keyof Individual] as unknown as number;
            const second = b[sortDescriptor.column as keyof Individual] as unknown as number;
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);


    /*
    * Cell render method
    * */
    const renderCell = React.useCallback((individual: Individual, columnKey: React.Key) => {
        const cellValue = individual[columnKey as keyof Individual];

        switch (columnKey) {
            case "id":
                return (
                    <NavLink to={`/individuals/${cellValue}`}
                             className={"hover:underline hover:font-semibold transition-all"}>{cellValue}</NavLink>
                );
            case "birth_date":
                return (
                    <p className="text-bold text-small capitalize">{cellValue?.toString().slice(0, 11)}</p>
                );
            case "status":
                return (
                    <Chip className="capitalize" color={cellValue === "active" ? 'success' : 'danger'} size="sm"
                          variant="flat">
                        {statusMap[cellValue as keyof typeof statusMap] || cellValue}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <QuickActions ind={individual} trigger={
                            <Button isIconOnly size="sm" variant="light">
                                <VerticalDotsIcon/>
                            </Button>
                        }/>
                    </div>
                );
            case "father":
                if (Object.keys(cellValue as string).length === 0) {
                    return <p>-</p>
                } else {
                    const father = breeders.get(cellValue as string)

                    if (father) {
                        return (
                            <div>
                                <p className={"text-sm font-medium"}>{father.nickname}</p>
                                <p className={"text-tiny text-zinc-600"}>{father.id}</p>
                            </div>
                        );
                    } else {
                        return <p>-</p>
                    }

                }
            case "mother":
                return (
                    <p>{individuals.get(cellValue as string)?.id || '-'}</p>
                );
            case "gender":
                return (
                    <Chip className="capitalize" color={cellValue == "male" ? 'primary' : 'secondary'} size="sm"
                          variant="flat">
                        {cellValue === "male" ? 'Veir' : 'Søye'}
                    </Chip>
                )

            case "bottle":
                return (
                    cellValue && <Chip className="capitalize" size={"sm"} variant={"flat"} color={"primary"}>Kopp</Chip>
                )
            default:
                return cellValue;
        }
    }, [breeders, individuals]);


    const onRowsPerPageChange = React.useCallback((selectedKeys: Selection) => {
        const selectedValue = Array.from(selectedKeys)[0];
        setRowsPerPage(Number(selectedValue));
        setPage(1);
    }, []);


    const onSearchChange = React.useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, [])

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <Heading1>Besetning</Heading1>
                <div className="flex flex-col md:flex-row md:items-end justify-end gap-4"
                     suppressHydrationWarning>
                    <Input
                        variant={"bordered"}
                        isClearable
                        className="w-full sm:max-w-[30%] mr-auto"
                        placeholder="Søk etter øremerke"
                        startContent={<SearchIcon/>}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />

                    <Slider
                        className={"md:max-w-[180px]"}
                        label="Filtrer alder"
                        step={1}
                        minValue={currentYear - 10}
                        maxValue={currentYear}
                        defaultValue={ageFilter}
                        formatOptions={{useGrouping: false}}
                        onChange={(e) => {
                            Array.isArray(e) ? setAgeFilter(e) : setAgeFilter([e])
                        }}
                    />
                    <ButtonGroup>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button variant={"flat"}>
                                    Kjønn
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label={"gender selector"} disallowEmptySelection
                                          selectedKeys={genderFilter} selectionMode={"multiple"}
                                          onSelectionChange={(k) => setGenderFilter(k)}>
                                <DropdownItem key={"female"}>Søye</DropdownItem>
                                <DropdownItem key={"male"}>Veir</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button variant={"flat"}>
                                    Status
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label={"status selector"} disallowEmptySelection
                                          selectedKeys={activeFilter} selectionMode={"multiple"}
                                          onSelectionChange={(k) => setActiveFilter(k)}>
                                <DropdownItem key={"active"}>Aktive</DropdownItem>
                                <DropdownItem key={"inactive"}>Inaktive</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button variant={"flat"}>
                                    Kolonner
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </ButtonGroup>

                    <Dropdown>
                        <DropdownTrigger>
                            <Button variant={"shadow"} size={"lg"} startContent={<BoltIcon/>}
                                    color={"warning"} className={"text-white"}
                                    isDisabled={!(selectedKeys === "all" || selectedKeys.size > 0)}>
                                Handlinger
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label={"export selector"} disallowEmptySelection selectionMode={"single"}
                                      onSelectionChange={(k) => handleModalChange(k)}>
                            <DropdownItem key={"export"} startContent={<PrinterIcon/>}
                                          color={"primary"}>Eksporter</DropdownItem>
                            <DropdownItem key={"medicine"} startContent={<HeartIcon/>} color={"secondary"}>Ny
                                medisinering</DropdownItem>

                            <DropdownItem key={"mass_deactivation"} startContent={<WarningIcon/>} color={"danger"}>
                                Utmelding
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>


                </div>
            </div>
        );
    }, [filterValue, onSearchChange, currentYear, ageFilter, genderFilter, activeFilter, visibleColumns, selectedKeys, onClear]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <div className={"flex flex-col gap-2"}>
                    <div className=" text-small text-default-400">
                        {selectedKeys === "all"
                            ? "Alle individer markert"
                            : `${selectedKeys.size} av ${filteredItems.length} markert`}
                    </div>

                    <Tooltip content={"Tilbakestill alle filtere"}>
                        <Button size="sm" variant="flat" className={"w-fit"} onPress={clearFilterData}>
                            Tilbakestill
                        </Button>
                    </Tooltip>
                </div>

                <div className={"flex flex-col gap-2"}>
                    <label className="flex items-center gap-2 ml-auto text-default-400 text-small">
                        Rader per side:
                        <Dropdown>
                            <DropdownTrigger>
                                <Button size={"sm"} variant={"ghost"}>{rowsPerPage}</Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                onSelectionChange={onRowsPerPageChange}
                                selectionMode="single"
                                aria-label={"pagination selection"}
                                disallowEmptySelection
                            >
                                {Array.of(5, 10, 25, 50, 100).map((value) =>
                                    <DropdownItem key={value}>{value}</DropdownItem>
                                )}
                            </DropdownMenu>
                        </Dropdown>
                    </label>

                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        className={"ml-auto"}
                        page={page}
                        total={pages}
                        onChange={setPage}
                    />
                </div>
            </div>
        );
    }, [selectedKeys, page, pages, onRowsPerPageChange, rowsPerPage, filteredItems.length]);


    return (
        <div className="w-full lg:w-4/5 m-auto p-4 sm:p-8">

            <Table
                aria-label="Example table with custom cells, pagination and sorting"
                isHeaderSticky
                isStriped
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                className={"sm:max-h-[85vh]"}
                selectedKeys={selectedKeys}
                selectionMode="multiple"
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSelectionChange={setSelectedKeys}
                onSortChange={setSortDescriptor}

            >
                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === "actions" ? "center" : "start"}
                            allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody emptyContent={"Ingen individer funnet"} items={sortedItems}>
                    {(item) => (
                        <TableRow key={item.doc}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <Modal isOpen={isOpen} onClose={onOpenChange}>
                <ModalContent>
                    <ModalHeader>
                        {selectedModal === "export" && "Skriv ut liste"}
                        {selectedModal === "medicine" && "Ny medisinering"}
                        {selectedModal === "mass_deactivation" && "Utmelding"}
                    </ModalHeader>
                    <ModalBody className={"mb-4"}>
                        {selectedModal === "export" &&
                            <ExportModal selectedCols={visibleColumns} items={selectedFilteredItems}/>}

                        {
                            selectedModal === "medicine" &&
                            <MassMedicine items={selectedFilteredItems}/>
                        }
                        {
                            selectedModal === "mass_deactivation" &&
                            <MassDeactivation items={selectedFilteredItems}/>
                        }
                    </ModalBody>

                </ModalContent>
            </Modal>
        </div>
    );
}
