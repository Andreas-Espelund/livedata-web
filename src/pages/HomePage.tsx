import {Row, Stack} from "@/components/Layout";
import {Card, CardHeader, CardBody, Image, Spacer} from "@nextui-org/react";
import NavigationCard from "@/components/NavigationCard";
import {Heading1} from "@/components/Headings";


export default function HomePage() {

    return (
        <div className={"h-[90vh] grid place-content-center"}>
            <Stack gap={"large"}>
                <h1 className={"font-semibold text-5xl"}>SNARVEGAR</h1>
                <Row>
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
                </Row>
            </Stack>
        </div>
    )
}