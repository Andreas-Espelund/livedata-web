import {Outlet} from "react-router-dom";

export const NoticeWrapper = () => {
    return (
        <div className={"fixed flex flex-col gap-4 w-5/6 sm:w-1/3 top-20 right-4 z-50 "}>
            <Outlet/>
        </div>
    )
}