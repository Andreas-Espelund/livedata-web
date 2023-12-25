import {Button, Card} from "@nextui-org/react";
import {useEffect, useState} from "react";
import "./NoticeBox.css"

export function NoticeBox({title, message, type}: {
    title: string,
    message: string,
    type: "warning" | "danger" | "info" | "success"
}) {

    const [isVisible, setIsVisible] = useState(true);
    const [animationClass, setAnimationClass] = useState("noticeBox-enter");

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimationClass("noticeBox-exit");
            setTimeout(() => setIsVisible(false), 500); // Corresponds to animation duration
        }, 8000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setAnimationClass("noticeBox-exit");
        setTimeout(() => setIsVisible(false), 500); // Corresponds to animation duration
    };

    const colorMap = {
        'warning': 'bg-warning-400',
        'danger': 'bg-danger-400 text-white',
        'info': 'bg-primary-400 text-white',
        'success': 'bg-success-400 text-white'
    }

    const iconMap = {
        'warning': <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                        stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
        </svg>,
        'danger': <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                       stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
        </svg>,
        'success': <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                        stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
        </svg>,
        'info': <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"/>
        </svg>
    }

    const color = colorMap[type] // set the color
    const icon = iconMap[type] // set the icon


    if (!isVisible) {
        return null
    }
    return (
        <Card className={`w-full ${color} noticeBox-container ${animationClass}`}>
            <div className={"flex items-center p-4 gap-4"}>
                <div>
                    {icon}
                </div>
                <div className={""}>
                    <p className={"font-bold"}>{title}</p>
                    <p className={"text-small"}>{message}</p>
                </div>

                <Button isIconOnly variant={"light"} className={`ml-auto ${color}`} onPress={handleClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
                    </svg>
                </Button>
            </div>
        </Card>
    )
}