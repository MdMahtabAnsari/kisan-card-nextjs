"use client";

import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import {Search} from "lucide-react";

interface InputProps{
    value:string
    onValueChange:(value:string)=>void
}

export function Input({value,onValueChange}:InputProps){

    return(
        <InputGroup >
            <InputGroupInput placeholder="enter amount" value={value} onChange={(e) => onValueChange(e.target.value)} />
            <InputGroupAddon>
                <Search />
            </InputGroupAddon>
        </InputGroup>
    )
}