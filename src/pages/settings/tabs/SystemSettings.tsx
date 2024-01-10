import {Button, Card, CardBody, CardHeader} from "@nextui-org/react";
import {Heading2} from "@/components/";

const SystemSettings = () => {
    return (
        <>
            <Card fullWidth>
                <CardHeader>
                    <Heading2>System</Heading2>
                </CardHeader>
                <CardBody>
                    <div>
                    <p className={"font-medium mb-2"}>Tøm browser cache</p>
                        <Button size={"sm"} variant={"bordered"} color={"danger"} onPress={() => localStorage.clear()}>
                            Tøm
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </>
    )
}

export default SystemSettings;