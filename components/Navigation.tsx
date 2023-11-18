import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";

export default function Navigation() {
    const router = useRouter();

    return (
        <div className="flex gap-2 items-center">
            <Button isIconOnly radius="full" size="sm" className="bg-black" onClick={router.back}>
                <i className="icon-arrow_back text-[20px] text-center pl-2 py-2 mobile:text-base mobile:py-1"></i>
            </Button>

            <Button isIconOnly radius="full" size="sm" className="bg-black" onClick={router.forward}>
                <i className="icon-arrow_back rotate-180 text-[20px] text-center pl-2 py-2 mobile:text-base mobile:py-1"></i>
            </Button>
        </div>
    );
}
