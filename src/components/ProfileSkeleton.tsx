import {Card, Skeleton} from "@nextui-org/react";

const ProfileSkeleton = () => {
    return (

        <div className="w-full lg:w-4/5 m-auto p-2 sm:p-8 grid gap-10">

            <div className={"flex gap-4"}>
                <Skeleton className="w-40 rounded-lg">
                    <div className="h-8 w-4/5 rounded-lg bg-default-200"></div>
                </Skeleton>

                {Array.of(1, 2, 3).map((i) =>
                    <Skeleton key={i} className="w-16 rounded-lg">
                        <div className="h-8  rounded-lg bg-default-200"></div>
                    </Skeleton>
                )}
            </div>
            <div className={"grid md:grid-cols-3 gap-10 w-full"}>
                {Array.of(1, 2, 3).map((i) =>
                    <Card key={i} className="space-y-5 p-4" radius="lg">
                        <Skeleton className="rounded-lg">
                            <div className="h-48 rounded-lg bg-default-300"></div>
                        </Skeleton>
                        <div className="space-y-3">
                            <Skeleton className="w-3/5 rounded-lg">
                                <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                            </Skeleton>
                            <Skeleton className="w-4/5 rounded-lg">
                                <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                            </Skeleton>
                            <Skeleton className="w-2/5 rounded-lg">
                                <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                            </Skeleton>
                        </div>
                    </Card>
                )}
            </div>
            <Card className="space-y-5 p-4" radius="lg">

                <div className="space-y-3">

                    <Skeleton className="w-1/5 rounded-lg">
                        <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                    </Skeleton>
                    <Skeleton className="w-3/5 rounded-lg">
                        <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                    </Skeleton>
                </div>
                <Skeleton className="rounded-lg">
                    <div className="h-48 rounded-lg bg-default-300"></div>
                </Skeleton>
            </Card>
        </div>
    );
}

export default ProfileSkeleton;