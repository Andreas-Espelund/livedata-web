import {Button} from "@nextui-org/react";
import React from "react";

interface MessageProps {
    text: string;
    variant: "Error" | "Success" | "Warning" | "Info"; // Add more variants as needed
    onClose: () => void;
}

const Message: React.FC<MessageProps> = ({text, variant, onClose}) => {
    let bgColor = "";
    let iconPath = "";

    switch (variant) {
        case "Error":
            bgColor = "bg-red-400";
            iconPath =
                "M6 18L18 6M6 6l12 12";
            break;
        case "Success":
            bgColor = "bg-green-400";
            iconPath =
                "M5 13l4 4L19 7";
            break;
        case "Warning":
            bgColor = "bg-yellow-400";
            iconPath =
                "M12 2L2 20h20";
            break;
        case "Info":
            bgColor = "bg-blue-400";
            iconPath =
                "M12 4v16M12 8v4";
            break;
        default:
            bgColor = "bg-gray-400";
            break;
    }

    return (
        <div className={`rounded-lg p-4 ${bgColor}`}>
            <div className="flex items-center justify-between">
                <p className="text-white mr-4">{text}</p>
                <Button isIconOnly={true} onPress={onClose} color={"none"}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="white" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>

                </Button>
            </div>
        </div>
    );
};

export default Message;
