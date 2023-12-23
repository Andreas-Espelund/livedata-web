export type Individual = {
    id: string;
    birth_date: string;
    status: string;
    gender: string;
    bottle?: boolean;
    mother?: string;
    father?: string;
};


export type Breeder = {
    id: string,
    nickname: string,
    tag: string
}