import {Row, Stack} from "@/components/Layout";
import {Card, CardHeader, CardBody, Image, Spacer, Link} from "@nextui-org/react";
import NavigationCard from "@/components/NavigationCard";
import {Heading1} from "@/components/Headings";


export const HomePage = () => {

    return (
        <div className={"flex flex-col gap-10 p-4 md:p-10 m-auto w-fit"}>
            <h1 className={"font-semibold text-3xl"}>SNARVEGAR</h1>
            <div className={"flex gap-10 flex-col md:flex-row"}>
                <NavigationCard
                    title="Besetning"
                    subtitle="Oversikt over individer"
                    image="/flock.png"
                    alt="Sheep"
                    href="/individuals"
                />
                <NavigationCard
                    title="Registrering"
                    subtitle="Legg til nye data"
                    image="/vet.png"
                    alt="Sheep"
                    href="/register"
                />
                <NavigationCard
                    title="Innstillinger"
                    subtitle="Snarvei"
                    image="/mech.png"
                    alt="Sheep"
                    href="/settings"
                />
            </div>
        </div>
    )
}