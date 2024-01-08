export type Individual = {
    id: string;
    birth_date: string;
    status: string;
    gender: string;
    bottle?: boolean;
    mother?: string;
    father?: string;
    doc: string;
};


export type Breeder = {
    id: string,
    nickname: string,
    birth_date: string,
    status: string,
    doc: string
}

export type BirthRecord = {
    mother: string;
    father: string;
    date: string;
    lambs: string[];
    note: string;
}

export type StatusRecord = {
    individual: string;
    date: string;
    status: string;
    note: string;
}

export type NoteRecord = {
    individual: string;
    date: string;
    note: string;
}

export type MedicineRecord = {
    individual: string;
    date: string;
    medicine: string;
}