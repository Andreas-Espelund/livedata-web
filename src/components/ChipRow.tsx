import {Individual} from "@/types/types";
import {Chip} from "@nextui-org/react";
import {statusMap} from "@/pages/individuals";

interface ChipRowProps {
    ind: Individual;
    size: "sm" | "md" | "lg";
}

const ChipRow = ({ind, size}: ChipRowProps) => {
    return (
        <div className={size === "sm" ? "flex gap-2" : "flex gap-4"}>
            <Chip className="capitalize" color={ind?.status === "active" ? 'success' : 'danger'} size={size}
                  variant="flat">
                {statusMap[ind?.status as keyof typeof statusMap] || ind?.status}
            </Chip>
            <Chip className="capitalize" color={ind?.gender == "male" ? 'primary' : 'secondary'} size={size}
                  variant="flat">
                {ind?.gender === "male" ? 'Veir' : 'Søye'}
            </Chip>
            {ind?.bottle &&
                <Chip className="capitalize" size={size} variant={"flat"} color={"warning"}>Kopp</Chip>}
        </div>
    )
}


export default ChipRow;