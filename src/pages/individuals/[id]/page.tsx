'use client'
import {Individual} from '@/types/types'
import React, {useEffect, useState} from 'react'
import {Container, Row, Stack} from "@/components/Layout";
import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {Heading1, Heading3} from "@/components/Headings";
import {Button} from "@nextui-org/react";


const empty: Individual = {
    id: 0,
    birth_date: '',
    active: false,
    gender: false
}

const items: Individual[] = [
    {
        id: 10010,
        birth_date: '01.04.2015',
        active: true,
        gender: true,
        mother: 20020,
        father: 30030,
        bottle: false,
    },
    {
        id: 30030,
        birth_date: '01.04.2012',
        active: true,
        gender: false,
        mother: undefined,
        father: undefined,
        bottle: false,
    },
    {
        id: 20020,
        birth_date: '01.04.2013',
        active: true,
        gender: true,
        mother: undefined,
        father: undefined,
        bottle: false,
    },
]

export default function page({params}: { params: { id: number } }) {
    const [first, setfirst] = useState(empty)


    useEffect(() => {
        setfirst(items.filter(e => e.id == params.id)[0])
    }, [])

    return (
        <div className={"w-2/3 m-auto"}>
            <Container>
                <Button
                    onClick={() => window.history.back()}
                    variant={"light"}
                    startContent={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
                        </svg>
                    }
                >
                    Back
                </Button>
                <Stack centering={"start"}>
                    <Heading1>{params.id}</Heading1>
                    <Card fullWidth>
                        <CardHeader>
                            <Heading3>Viktig informasjon</Heading3>
                        </CardHeader>
                        <CardBody>
                            <p>{first?.birth_date || "lol"}</p>
                        </CardBody>
                    </Card>

                    <Card fullWidth>
                        <CardHeader>
                            <Heading3>Actions</Heading3>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Button color={"primary"} variant={"flat"} size={"lg"}> Quick action </Button>
                                <Button color={"primary"} variant={"flat"} size={"lg"}> Quick action </Button>
                                <Button color={"primary"} variant={"flat"} size={"lg"}> Quick action </Button>
                                <Button color={"primary"} variant={"flat"} size={"lg"}> Quick action </Button>
                                <Button color={"primary"} variant={"flat"} size={"lg"}> Quick action </Button>
                                <Button color={"primary"} variant={"flat"} size={"lg"}> Quick action </Button>
                                <Button color={"primary"} variant={"flat"} size={"lg"}> Quick action </Button>
                            </Row>
                        </CardBody>
                    </Card>

                    <Card fullWidth>
                        <CardHeader>
                            <Heading3>
                                Helse
                            </Heading3>
                        </CardHeader>
                        <CardBody>
                            <p>Event ... </p>
                            <p>Event ... </p>
                            <p>Event ... </p>
                            <p>Event ... </p>

                        </CardBody>
                    </Card>


                    <Card fullWidth>
                        <CardHeader>
                            <Heading3>
                                Notater
                            </Heading3>
                        </CardHeader>
                        <CardBody>
                            <p>Notes notes notes...</p>
                            <p>Notes notes notes...</p>
                            <p>Notes notes notes...</p>
                        </CardBody>
                    </Card>
                </Stack>
            </Container>
        </div>

    )
}
