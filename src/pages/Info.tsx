import {Heading1} from "@/components/Headings";
import {Accordion, AccordionItem, Button, Card, Skeleton} from "@nextui-org/react";
import {CardBody, CardHeader} from "@nextui-org/card";
import {ChevronLeft} from "@/images/icons";
import {useNavigate} from "react-router-dom";

const Placholder = () => {
    return (
        <Card className="w-[200px] space-y-5 p-4" radius="lg">
            <Skeleton className="rounded-lg">
                <div className="h-24 rounded-lg bg-default-300"></div>
            </Skeleton>
            <div className="space-y-3">
                <Skeleton className="w-3/5 rounded-lg">
                    <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                    <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                    <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                </Skeleton>
            </div>
        </Card>
    )
}

const Info = () => {

    const navigate = useNavigate()

    const faq = [
        {
            question: "Hva koster dette da?",
            answer: "Ikkje en drit"
        },
        {
            question: "Hva koster dette da?",
            answer: "Ikkje en drit"
        }
    ]

    const guides = Array.of(1,2,3,4)
    return (
        <div className={"p-10 max-w-[1000px] m-auto grid gap-10"}>
            <div>
                <Button color={"primary"} startContent={<ChevronLeft/>} onPress={() => navigate('/')}>
                    Tilbake
                </Button>
            </div>

            <Heading1>Ofte stilte spørsmål</Heading1>

            <Accordion variant={"bordered"}>
                {
                    faq.map((item, idx) =>
                        <AccordionItem title={item.question} key={idx}>
                            {item.answer}
                        </AccordionItem>
                    )
                }
            </Accordion>

            <Heading1>Tips og triks</Heading1>
            <Card>
                <CardHeader className={"text-lg font-medium"}> Some shit </CardHeader>
                <CardBody>
                    Idk tbh
                </CardBody>
            </Card>


            <Heading1>Guider</Heading1>
            <div className={"flex gap-4 justify-between"}>
                {guides.map((item) =>
                    <Placholder key={item}/>
                )}

            </div>

        </div>
    )
}

export default Info