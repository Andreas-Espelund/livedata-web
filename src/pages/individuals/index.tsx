import React, { useEffect} from "react";
import {
    Button,
    Chip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
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

import { SearchIcon, VerticalDotsIcon} from "../../../public/icons";
import {Individual} from "@/types/types";
import {Heading1} from "@/components/Headings";
import {PlusIcon} from "@/images/icons";
import MedicineRegistrationModal from "@/pages/individuals/MedicineRegistrationModal";
import {useAppContext} from "@/context/AppContext";
import {NavLink} from "react-router-dom";


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

const statusMap = {
    "active": "Aktiv",
    "lost_in": "Tapt innmark",
    "lost_out": "Tapt utmark",
    "slaught": "Slakt",
    "euthanized": "Avlivet",
    "inactive": "Inaktiv"
}


const capitalize = (str: string) => {
    return str.toUpperCase()
}

const DEFAULTS :Record<string, any> = {
    "columns" : ["id", "birth_date", "status", "father", "mother", "gender", "actions", "bottle"],
    "status" : ["active"],
    "genders": ["male", "female"],
    "year": [2024 - 5, 2024],
    "pages" : 10
}


// Function to get value from local storage or return default
const get_local_or_default_value = (key: string): any => {
    const storedItem = localStorage.getItem(key);

    return storedItem !== null ? JSON.parse(storedItem) : DEFAULTS[key]

};


export const  IndividualsPage = () => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const {individuals} = useAppContext()

    const currentYear = new Date().getFullYear()
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(get_local_or_default_value("columns")));
    const [genderFilter, setGenderFilter] = React.useState<Selection>(new Set(get_local_or_default_value("genders")));
    const [activeFilter, setActiveFilter] = React.useState<Selection>(new Set(get_local_or_default_value("status")));
    const [rowsPerPage, setRowsPerPage] = React.useState(get_local_or_default_value("pages"));
    const [page, setPage] = React.useState(1);
    const [ageFilter, setAgeFilter] = React.useState<number[] | number>(get_local_or_default_value("year"))
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


    const clearFilterData = () => {
        setAgeFilter(DEFAULTS["year"])
        setVisibleColumns(new Set(DEFAULTS["columns"]))
        setGenderFilter(new Set(DEFAULTS["genders"]))
        setActiveFilter(new Set(DEFAULTS["status"]))
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
        let filtered = [...individuals];

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
            if (statuses[0] == "active"){
                filtered = filtered.filter(ind => statuses[0] ===  ind.status)
            } else {
                filtered = filtered.filter(ind => "active" !==  ind.status)
            }
        }

        return filtered;
    }, [individuals, filterValue, genderFilter, ageFilter, activeFilter]);


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
            const first = a[sortDescriptor.column as keyof Individual] as number;
            const second = b[sortDescriptor.column as keyof Individual] as number;
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);


    // for medicine modal
    const keyArray = Array.from(selectedKeys)
    const modalItems = selectedKeys === "all" ? filteredItems : individuals.filter(e => keyArray.includes(e.doc))


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
                    <p className="text-bold text-small capitalize">{cellValue?.slice(0, 11)}</p>
                );
            case "status":
                return (
                    <Chip className="capitalize" color={cellValue === "active" ? 'success' : 'danger'} size="sm"
                          variant="flat">
                        {statusMap[cellValue]}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">
                                    <VerticalDotsIcon/>
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label={"action menu"}>
                                <DropdownItem href={`/individuals/${individual.id}`}>Detaljer</DropdownItem>
                                <DropdownItem>Ny lambing</DropdownItem>
                                <DropdownItem>Ny utmelding</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            case "father":

                if (Object.keys(cellValue).length === 0) {
                    return <p>-</p>
                } else {
                    return (
                        <div>
                            <p className={"text-sm font-medium"}>{cellValue.nickname}</p>
                            <p className={"text-tiny text-zinc-600"}>{cellValue.id}</p>
                        </div>
                    );
                }
            case "mother":
                if (Object.keys(cellValue).length === 0) {
                    return <p>-</p>
                } else {
                    return (
                        <p>{cellValue.id}</p>
                    );
                }

            case "gender":
                return (
                    <Chip className="capitalize" color={cellValue == "male"? 'primary' : 'secondary'} size="sm"
                          variant="flat">
                        {cellValue === "male"? 'Veir' : 'Søye'}
                    </Chip>
                )

            case "bottle":
                return (
                    cellValue && <Chip className="capitalize" size={"sm"} variant={"flat"} color={"primary"}>Kopp</Chip>
                )
            default:
                return cellValue;
        }
    }, []);


    // page handling
    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = React.useCallback((selectedKeys: Selection) => {
        const selectedValue = Array.from(selectedKeys)[0];
        setRowsPerPage(Number(selectedValue));
        setPage(1);
    }, []);

    const onGenderFilterChange = React.useCallback((selectedKeys: Selection) => {
        const value = Array.from(selectedKeys)[0]
        setGenderFilter(value.toString())
    }, [])


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
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4" suppressHydrationWarning>
                    <Input
                        variant={"bordered"}
                        isClearable
                        className="w-full sm:max-w-[30%]"
                        placeholder="Søk etter øremerke"
                        startContent={<SearchIcon/>}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className={"flex flex-col md:flex-row gap-4 items-end"}>
                        <Slider
                            className={"md:max-w-[180px]"}
                            label="Filtrer alder"
                            step={1}
                            minValue={currentYear - 10}
                            maxValue={currentYear}
                            defaultValue={ageFilter}
                            formatOptions={{useGrouping: false}}
                            onChange={(e) => { Array.isArray(e) ?setAgeFilter(e) : setAgeFilter(Array.from(e) )}}
                        />
                        <div className={"grid grid-cols-3 gap-2  flex-wrap"}>
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button variant={"flat"}>
                                        Kjønn
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label={"gender selector"} disallowEmptySelection selectedKeys={genderFilter} selectionMode={"multiple"} onSelectionChange={(k) => setGenderFilter(k)}>
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
                                <DropdownMenu aria-label={"status selector"} disallowEmptySelection selectedKeys={activeFilter} selectionMode={"multiple"} onSelectionChange={(k) => setActiveFilter(k) }>
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
                        </div>
                        <Button isDisabled={keyArray.length === 0} onPress={onOpen} variant={"shadow"} size={"lg"} color={"primary"} startContent={<PlusIcon/>}>
                            Medisin
                        </Button>
                    </div>
                </div>
            </div>
        );
    }, [
        filterValue,
        visibleColumns,
        onSearchChange,
        individuals.length,
        hasSearchFilter,
        genderFilter,
        ageFilter,
        activeFilter,
        keyArray
    ]);

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
                                <DropdownItem key="5">5</DropdownItem>
                                <DropdownItem key="10">10</DropdownItem>
                                <DropdownItem key="25">25</DropdownItem>
                                <DropdownItem key="50">50</DropdownItem>
                                <DropdownItem key="100">100</DropdownItem>
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
    }, [selectedKeys, items.length, page, pages, hasSearchFilter,onRowsPerPageChange, rowsPerPage,]);




    return (
        <div className="w-full lg:w-4/5 m-auto p-4 sm:p-8 ">

            <Table
                aria-label="Example table with custom cells, pagination and sorting"
                isHeaderSticky
                isStriped
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                    wrapper: "max-h-[90vh]",
                }}
                selectedKeys={selectedKeys}
                selectionMode="multiple"
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSelectionChange={setSelectedKeys}
                onSortChange={setSortDescriptor}

            >
                <TableHeader columns={headerColumns} >
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
            <MedicineRegistrationModal isOpen={isOpen} onClose={onOpenChange} selectedRows={modalItems}/>
        </div>
    );
}
