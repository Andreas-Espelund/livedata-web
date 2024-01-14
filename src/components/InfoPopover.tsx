import {Button, Popover, PopoverContent, PopoverTrigger} from "@nextui-org/react";

import {ReactNode} from "react";


interface InfoPopoverProps {
    children: ReactNode,
    maxWidth: boolean
}
export const InfoPopover = ({children, maxWidth}: InfoPopoverProps) => {
    return (
        <Popover placement="right-end">
            <PopoverTrigger>
                <Button isIconOnly color="warning" variant="light">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"/>
                    </svg>
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className={`p-1 py-2 flex flex-col gap-1 flex-wrap ${maxWidth ? "": "max-w-[200px]" }`}>
                    {children}
                </div>
            </PopoverContent>
        </Popover>
    )
}