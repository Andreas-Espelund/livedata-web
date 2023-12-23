import { NextRequest, NextResponse } from "next/server";
import { Individual } from "@/types/types";

export async function GET(request: NextRequest){
    let response:Individual  = {
        id: 10010,
        birth_date: "01-04-2018",
        active: false,
        gender: false,
        mother: 20020,
        father: 30030
    }

    return NextResponse.json(response)
}