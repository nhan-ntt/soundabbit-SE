import React from "react";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "@/components/icons/EyeFilledIcon";
import { Input } from "@nextui-org/react";

export default function InputPassword({ register, ...props }: any) {

    const [isVisible, setIsVisible] = React.useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <Input
            variant="bordered"
            {...register}
            endContent={
                <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                >
                    {isVisible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                </button>
            }
            type={isVisible ? "text" : "password"}
            className="max-w-xs"
            {...props}
        />
    );
}
