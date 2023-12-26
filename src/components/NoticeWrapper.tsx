const NoticeWrapper = ({children}) => {
    return (
        <div className={"fixed flex flex-col gap-4 w-1/3 top-20 right-4 z-50 "}>
            {children}
        </div>
    )
}

export default NoticeWrapper;