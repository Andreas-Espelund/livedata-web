import {ReactNode} from "react";

interface NoticeWrapperProps {
    children: ReactNode;
}
export const NoticeWrapper = ({children}: NoticeWrapperProps) => {
    return (
        <div className={"fixed flex flex-col gap-4 w-5/6 sm:w-1/3 top-20 right-4 z-50 "}>
            {children}
        </div>
    )
}