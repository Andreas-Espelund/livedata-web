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