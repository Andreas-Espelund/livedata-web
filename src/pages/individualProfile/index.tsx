import {NavLink, useParams} from "react-router-dom";
import {useAppContext} from "@/context/AppContext";
import {
    CardBody,
    CardHeader,
    Card, Tabs, Tab, Button
} from "@nextui-org/react";
import {Heading1, Heading2} from "@/components";
import {BoltIcon, CakeIcon, ChevronLeft} from "@/images/icons";
import ProfileSkeleton from "@/components/ProfileSkeleton";
import ChipRow from "@/components/ChipRow";

import QuickActions from "@/components/QuickActions";


const IndividualProfile = () => {
    const {id} = useParams<{ id: string }>();
    const {getIndividualFromID, individuals, breeders} = useAppContext()

    const individual = id ? getIndividualFromID(id) : null

    if (!individual) return <ProfileSkeleton/>


    const age = new Date().getFullYear() - new Date(individual.birth_date).getFullYear();


    const lambs = Array.from(individuals.values()).filter(ind => ind.mother === individual.doc);


    return (
        <div className="w-full lg:w-4/5 m-auto p-2 sm:p-8 grid gap-10">
            <NavLink to="/individuals"
                     className="text-primary  flex items-center gap-2 rounded-xl w-fit p-3 px-4 hover:bg-primary/20 transition-all focus:scale-95">
                <ChevronLeft/>
                Besetning
            </NavLink>
            <div className={"flex items-center justify-between"}>
                <div className={"flex items-center gap-4"}>
                    <Heading1>{individual?.id}</Heading1>
                    <ChipRow ind={individual} size={"md"}/>
                </div>

                <QuickActions ind={individual} trigger={
                    <Button startContent={<BoltIcon/>} variant={"shadow"} size={"lg"} color={"warning"}
                            className={"text-white"}>
                        Ny Registrering
                    </Button>
                }/>


            </div>
            <div className={"grid md:grid-cols-3 gap-10 w-full"}>
                <Card className={"max-w-4xl"}>
                    <CardHeader>
                        <Heading2>Info</Heading2>
                    </CardHeader>
                    <CardBody>
                        <table className={"h-full"}>
                            <tbody>
                            <tr>
                                <td className="text-lg font-bold">ID:</td>
                                <td className="font-normal">{individual?.id}</td>
                            </tr>
                            <tr>
                                <td className="text-lg font-bold">Alder:</td>
                                <td className="font-normal">{age === 0 ? " > 1 år" : `${age} år`}</td>
                            </tr>
                            <tr>
                                <td className="text-lg font-bold">Født dato:</td>
                                <td className="font-normal">{individual?.birth_date}</td>
                            </tr>

                            <tr>
                                <td className="text-lg font-bold">Mor:</td>
                                <td className="font-normal">{individuals.get(individual.mother!)?.id || "Ikkje registrert"}</td>
                            </tr>
                            <tr>
                                <td className="text-lg font-bold">Far:</td>
                                <td className="font-normal">{breeders.get(individual.father!)?.id || "Ikkje registrert"}</td>
                            </tr>
                            </tbody>
                        </table>
                    </CardBody>
                </Card>

                <Card className={"max-w-4xl"}>
                    <CardHeader>
                        <Heading2>Lamb</Heading2>
                    </CardHeader>
                    <CardBody>
                        <table className={"grid h-full"}>
                            {lambs.length === 0 ?
                                <tbody
                                    className={"bg-primary/10 flex flex-col items-center justify-center gap-4 rounded-lg text-xl font-medium"}>
                                <tr>
                                    <td className={"flex flex-col justify-center items-center"}>
                                        <CakeIcon/>
                                        Ingen lamb
                                    </td>
                                </tr>
                                </tbody> :
                                <tbody className={"flex flex-col gap-4"}>
                                {lambs.map((lamb) =>
                                    <tr className={"flex justify-between"} key={lamb.id}>
                                        <td><NavLink to={`/individuals/${lamb.id}`}
                                                     className={"font-semibold"}>{lamb.id}</NavLink></td>
                                        <td><ChipRow ind={lamb} size={"sm"}/></td>
                                    </tr>
                                )}
                                </tbody>}
                        </table>
                    </CardBody>
                </Card>

                <Card className={"max-w-4xl"}>
                    <CardHeader>
                        <Heading2>Posisjon</Heading2>
                    </CardHeader>
                    <CardBody>
                        <img
                            alt={"map"}
                            className={"object-cover overflow-hidden rounded-lg"}
                            src={"https://map.viamichelin.com/map/carte?map=viamichelin&z=10&lat=61.90739&lon=5.99383&width=550&height=382&format=png&version=latest&layer=background&debug_pattern=.*"}/>
                    </CardBody>
                </Card>
            </div>

            <div className={"grid gap-4"}>
                <Heading1>Detaljer</Heading1>
                <Tabs radius={"lg"}>
                    <Tab key={"lamb"} title={"Lambinger"} className={"w-full"}>
                        <Card fullWidth>
                            <CardHeader>
                                <Heading2>Lamminger</Heading2>
                            </CardHeader>
                            <CardBody>
                                todo
                            </CardBody>
                        </Card>
                    </Tab>
                    <Tab key={"med"} title={"Helse og medisinering"}>
                        <Card fullWidth>
                            <CardHeader>
                                <Heading2>Helse</Heading2>
                            </CardHeader>
                            <CardBody>
                                todo
                            </CardBody>
                        </Card>
                    </Tab>
                    <Tab key={"notes"} title={"Notater"} className={"w-full"}>
                        <Card fullWidth>
                            <CardHeader>
                                <Heading2>Notater</Heading2>
                            </CardHeader>
                            <CardBody>
                                todo
                            </CardBody>
                        </Card>
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}

export default IndividualProfile;