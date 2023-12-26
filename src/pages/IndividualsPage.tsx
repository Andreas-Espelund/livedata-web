import React, {useContext} from "react";
import {
    AutocompleteItem,
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
    TableRow
} from "@nextui-org/react";

import {ChevronDownIcon, FilterIcon, PlusIcon, SearchIcon, VerticalDotsIcon} from "../../public/icons";
import {Context} from "@/App";
import {Individual} from "@/types/types";
import {Heading1} from "@/components/Headings";

const columns = [
    {name: "ID (ØREMERKE)", uid: "id", sortable: true},
    {name: "FØDT DATO", uid: "birth_date", sortable: true},
    {name: "STATUS", uid: "status", sortable: true},
    {name: "FAR", uid: "father", sortable: true},
    {name: "MOR", uid: "mother", sortable: true},
    {name: "KJØNN", uid: "gender", sortable: true},
    {name: "KOPP", uid: "bottle", sortable: true},
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

const INITIAL_VISIBLE_COLUMNS = ["id", "birth_date", "status", "father", "mother", "gender", "actions", "bottle"];
const INITIAL_VISIBLE_STATUS = ["active"]

export default function IndividualsPage() {
    const currentYear = new Date().getFullYear()
    const {individuals} = useContext(Context)

    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [genderFilter, setGenderFilter] = React.useState<string>("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [page, setPage] = React.useState(1);
    const [ageFilter, setAgeFilter] = React.useState<number[] | number>([currentYear - 5, currentYear])
    const [activeFilter, setActiveFilter] = React.useState<Selection>(new Set(INITIAL_VISIBLE_STATUS))
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "tag",
        direction: "ascending",
    });




    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);


    // filtering
    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...individuals];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.id.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }

        if (genderFilter !== "all") {
            filteredUsers = filteredUsers.filter((ind) => ind.gender === genderFilter)
        }

        const range = Array.isArray(ageFilter) ? ageFilter : [ageFilter, ageFilter]

        filteredUsers = filteredUsers.filter(ind => {
            let year = Number(ind.birth_date.slice(0, 4))
            if (year < 1) year = currentYear
            return year >= range[0] && year <= range[1]

        })


        if (activeFilter) {
            const stat = Array.from(activeFilter)
            filteredUsers = filteredUsers.filter(ind => {
                return stat.length == 2 || stat[0] ===  ind.status
            })
        }

        return filteredUsers;
    }, [individuals, filterValue, genderFilter, ageFilter, activeFilter]);

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


    // cell render method
    const renderCell = React.useCallback((individual: Individual, columnKey: React.Key) => {
        const cellValue = individual[columnKey as keyof Individual];

        switch (columnKey) {
            case "id":
                return (
                    <a href={`/individuals/${cellValue}`}
                          className={"hover:underline hover:font-semibold transition-all"}>{cellValue}</a>
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
                            <DropdownMenu>
                                <DropdownItem href={`/individuals/${individual.id}`}>Detaljer</DropdownItem>
                                <DropdownItem>Ny lambing</DropdownItem>
                                <DropdownItem>Ny utmelding</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            case "father":
                return (
                    <p>{cellValue || 'ukjent'}</p>
                );
            case "mother":
                return (
                    <p>{cellValue || 'ukjent'}</p>
                );

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
                <div className="flex flex-col md:flex-row md:items-end  gap-4" suppressHydrationWarning>
                    <Input
                        variant={"bordered"}
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Søk etter øremerke"
                        startContent={<SearchIcon/>}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <Slider
                        className={"max-w-[200px]"}
                        label="Filtrer alder"
                        step={1}
                        minValue={currentYear - 10}
                        maxValue={currentYear}
                        defaultValue={[currentYear - 5, currentYear]}
                        formatOptions={{useGrouping: false}}
                        onChange={(e) => setAgeFilter(e)}
                    />

                    <Dropdown>
                        <DropdownTrigger>
                            <Button endContent={<FilterIcon className="text-small"/>} variant="flat">
                                Viser {
                                genderFilter === "all" && "alle" ||
                                genderFilter === "female" && "søyer" ||
                                "veirar"
                            }</Button>
                        </DropdownTrigger>
                        <DropdownMenu selectionMode={"single"} onSelectionChange={onGenderFilterChange}>
                            <DropdownItem key={"all"}>Alle</DropdownItem>
                            <DropdownItem key={"female"}>Søye</DropdownItem>
                            <DropdownItem key={"male"}>Veir</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button endContent={<FilterIcon className="text-small"/>} variant="flat">
                                Status filter
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu disallowEmptySelection selectedKeys={activeFilter} selectionMode={"multiple"} onSelectionChange={(k) => setActiveFilter(k) }>
                            <DropdownItem key={"active"}>Aktive</DropdownItem>
                            <DropdownItem key={"inactive"}>Inaktive</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Dropdown>
                        <DropdownTrigger className="hidden sm:flex">
                            <Button endContent={<ChevronDownIcon className="text-small"/>} variant="flat">
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



                    <label className="flex items-center gap-2 text-default-400 text-small">
                        Rader:
                        <Dropdown>
                            <DropdownTrigger>
                                <Button size={"sm"} variant={"ghost"}>{rowsPerPage}</Button>
                            </DropdownTrigger>
                            <DropdownMenu onSelectionChange={onRowsPerPageChange} selectionMode="single"
                                          disallowEmptySelection>
                                <DropdownItem key="5">5</DropdownItem>
                                <DropdownItem key="10">10</DropdownItem>
                                <DropdownItem key="25">25</DropdownItem>
                                <DropdownItem key="50">50</DropdownItem>
                                <DropdownItem key="100">100</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        visibleColumns,
        onSearchChange,
        onRowsPerPageChange,
        rowsPerPage,
        individuals.length,
        hasSearchFilter,
        genderFilter,
        ageFilter,
        activeFilter
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
              ? "Alle individer markert"
              : `${selectedKeys.size} av ${filteredItems.length} markert`}
        </span>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                        Forrige
                    </Button>
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
                        Neste
                    </Button>
                </div>
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    return (
        <div className="w-full lg:w-4/5 m-auto p-8">
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
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
