import {Card, CardBody, CardHeader, Image} from "@nextui-org/react";
import {NavLink} from "react-router-dom";


interface NavigationCardProps {
    title: string;
    subtitle: string;
    image: string;
    alt: string;
    href: string;
}


export default function NavigationCard({title, subtitle, image, alt, href}: NavigationCardProps){
    return (
        <NavLink to={href} className={"cursor-pointer hover:scale-[102%] focus:scale-[102%] active:scale-[99%] hover:outline-primary focus:outline-primary transition-all rounded-[16px]"}>
            <Card className="py-4 max-w-[400px]">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <p className="text-tiny uppercase font-bold">{subtitle}</p>
                    <h4 className="font-bold text-xl">{title}</h4>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                    <Image
                        alt={alt}
                        className="object-cover rounded-xl w-full flex aspect-[1.2]"
                        src={image}
                    />
                </CardBody>
            </Card>
        </NavLink>

    )
}