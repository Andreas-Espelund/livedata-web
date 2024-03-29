import {Accordion, AccordionItem, Button, Card, Chip, Code, Progress} from "@nextui-org/react";
import {CardBody, CardHeader} from "@nextui-org/card";
import {Heading2, InfoPopover, NoticeBox, NoticeWrapper} from "@/components";
import {Individual} from "@/types/types";
import React, {useState} from "react";
import {useAppContext} from "@/context/AppContext";
import {addIndividual} from "@/api/firestore/individuals";
import useStatus from "@/hooks/useStatus";
import {XIcon} from "@/images/icons";


export const DataSettings = () => {

    const {getIndividualFromID, getBreederFromID, user} = useAppContext()

    const {loading, success, error, startLoading, setSuccessState, setErrorState, resetStatus} = useStatus()
    const [individuals, setIndividual] = useState<Individual[]>([])
    const [faulty, setFaulty] = useState<{ content: string, line: number }[]>([])
    const [registered, setRegistered] = useState(0)
    const [filename, setFilename] = useState("")


    const validData = (bits: string[]): boolean => {
        // check array len
        if (bits.length !== 6) return false

        // check id field
        if (bits[0].length !== 5 || getIndividualFromID(bits[0])) return false

        // check gender field
        if (!(bits[1] === "female" || bits[1] === "male")) return false

        // check date filed
        if (isNaN(Number(new Date(bits[2])))) return false

        // check mother
        if (!(bits[3].length === 5 || bits[3] === "")) return false

        // check father
        if (!(bits[4].length === 5 || bits[4] === "")) return false

        // check bottle
        return bits[5] === "true" || bits[5] === "false";


    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return
        setFilename(file.name)

        const reader = new FileReader();

        reader.onload = function (e) {
            // Get the file content
            const text = e?.target?.result as string | null;

            if (!text) return

            let curLine = 0


            let items = text.split(/\r\n|\n/).map((str: string): Individual | undefined => {
                curLine++;
                const bits = str.split(',');

                if (!validData(bits)) {
                    if (bits.length === 1 && bits[0] === "") return undefined
                    setFaulty(e => [...e, {content: str, line: curLine}]);
                    return undefined;
                }

                return {
                    id: bits[0],
                    gender: bits[1],
                    birth_date: bits[2],
                    mother: getIndividualFromID(bits[3])?.doc || "",
                    father: getBreederFromID(bits[4])?.doc || "",
                    bottle: bits[5] === "true",
                    status: "active",
                    doc: ""
                };
            });

            items = items.filter((e): e is Individual => e !== undefined); // This cast removes undefined from the type
            setIndividual(items as Individual[]);
            console.log(items);

        };
        reader.readAsText(file);
    };


    const uploadHandler = () => {
        const fileupload = document.getElementById("fileupload") as HTMLInputElement | null
        if (fileupload) {
            fileupload.click()
        }

    }

    const registerHandler = async () => {
        if (!user || !user.authUser) return

        startLoading()
        const promises = individuals.map((ind) =>
            addIndividual(ind)
                .then(() => setRegistered(e => e + 1))
        )

        Promise.all(promises)
            .then(setSuccessState)
            .catch(setErrorState)
    }

    const resetPage = () => {
        setIndividual([])
        setFaulty([])
        setRegistered(0)
        setFilename("")
        resetStatus()
        const upload = document.getElementById("fileupload") as HTMLInputElement | null
        if (upload) {
            upload.value = ""
        }
    }

    const removeIndividual = (id: string) => {
        setIndividual(individuals.filter(e => e.id !== id))
    }

    const totalItems = individuals.length


    return (
        <>
            <Card>
                <CardHeader className={"flex justify-between"}>
                    <Heading2>Data</Heading2>
                    <InfoPopover maxWidth={true}>
                        <div className={"grid gap-2"}>
                            <p className={"text-lg font-semibold"}>Filformat</p>
                            <p>Filen må lagres som en .csv fil med en linje per individ</p>

                            <p className={"font-semibold"}>Format per linje</p>
                            <Code className={"w-fit"}>
                                individ,kjønn,fødselsdato,mor,far,kopplam?
                            </Code>
                            <p className={"font-semibold"}>Eksempel</p>
                            <Code className={"w-fit"}>
                                90061,female,2020-05-23,10010,50040,true
                            </Code>
                        </div>
                    </InfoPopover>
                </CardHeader>
                <CardBody className={"grid gap-4"}>

                    <p>Masseregistrering av individer</p>
                    <div className={"flex gap-4 items-center"}>
                        <Button
                            onPress={uploadHandler}
                            variant={"flat"}
                        >
                            Last opp fil
                        </Button>
                        {filename && <Code>{filename}</Code>}
                    </div>
                    <input
                        aria-label={"file upload"}
                        type="file"
                        id={"fileupload"}
                        className={"hidden"}
                        accept={".csv"}
                        onChange={handleFileChange}
                    />
                    {filename &&
                        <Accordion variant={"splitted"}>
                            <AccordionItem aria-label={"valid"} hidden={individuals.length === 0} key={"1"} title={<p
                                className={"text-success font-semibold"}>{`${individuals.length} ${individuals.length === 1 ? "gyldig individ" : "gyldige individer"}`}</p>}>
                                <div className={"flex flex-wrap gap-2 p-2"}>
                                    {individuals.map((e) =>
                                        <Chip
                                            endContent={<XIcon/>}
                                            variant={"flat"}
                                            color={"success"}
                                            className={"hover:bg-danger hover:text-white transition-all cursor-pointer"}
                                            key={e.id}
                                            onClick={() => removeIndividual(e.id)}
                                        >
                                            {e.id}
                                        </Chip>
                                    )}
                                </div>
                            </AccordionItem>

                            <AccordionItem aria-label={"invalid"} hidden={faulty.length === 0} key={"2"} title={<p
                                className={"text-danger font-semibold"}>{`${faulty.length} ${faulty.length === 1 ? "ugyldig individ" : "ugyldige individer"}`}</p>}>
                                <div className={"grid gap-2"}>
                                    <ul className={"list-disc bg-warning-100 p-4 rounded-lg"}>
                                        <p className={"text-lg font-semibold"}>Individ kan være ugyldige
                                            grunna: </p>
                                        <li className={"ml-4"}>Linja i fila ikkje følg det forventa formatet</li>
                                        <li className={"ml-4"}>Eit anna individ med samme ID nummer finnast allerede
                                            i besetninga
                                        </li>
                                    </ul>
                                    {faulty.map((e) =>
                                        <div key={e.line} className={"flex gap-2"}>
                                            <p className={"font-semibold"}>{`Linje ${e.line}:`}</p>
                                            <p>{e.content}</p>
                                        </div>
                                    )}
                                </div>
                            </AccordionItem>

                        </Accordion>
                    }


                    <div className={"flex gap-4 justify-end items-center"}>
                        <Progress
                            aria-label={"progress"}
                            className={loading || success || error ? "" : "hidden"}
                            value={registered}
                            maxValue={totalItems}
                            color={"success"}
                        />

                        <Button color={"danger"} variant={"light"} onPress={resetPage}>
                            Nullstill
                        </Button>
                        <Button color={"primary"} isLoading={loading} isDisabled={individuals.length === 0}
                                onPress={registerHandler}>
                            Registrer individer
                        </Button>
                    </div>
                </CardBody>
            </Card>

            <NoticeWrapper>
                <NoticeBox title={"Suksess"} message={`${registered} individer registrert`} type={"success"}
                           visible={success} onClose={resetStatus}/>
                <NoticeBox title={"Feil"} message={error?.message || "Noko gjekk gale"} type={"danger"}
                           visible={error !== null} onClose={resetStatus}/>
            </NoticeWrapper>
        </>
    )
}