import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";

const SidebarItem = ({ name, label }: { name: string; label: string }) => {
    const pathname = usePathname();

    const isActive = () => {
        return pathname === `/${name.toLowerCase()}`;
    };
    const iconName = () => {
        if (!isActive()) {
            return `icon-${name.toLowerCase()} mobile:text-[20px] text-white`;
        } else {
            return `icon-${name.toLowerCase()}-filled mobile:text-[20px]`;
        }
    };


    return (
        <Link href={`/${name.toLowerCase()}`}>
            <div
                className={classNames("transition-all hover:opacity-100 select-none cursor-pointer mt-4 flex flex-row items-center mobile:flex-col tablet:flex-col mini-laptop:w-full mini-laptop:mt-6 mobile:mt-0 tablet:mt-0 mobile:mx-8 tablet:mx-10",
                    {
                        "opacity-70": !isActive(),
                    },
                )}
            >
                <i
                    className={classNames("mr-4 mobile:mr-0 tablet:mr-0 mobile:mb-1 tablet:mb-1", iconName())}
                ></i>
                <p
                    className="mini-laptop:hidden text-white mobile:text-[10px] tablet:text-[10px] mobile: tablet:"
                >
                    {label}
                </p>
            </div>
        </Link >
    );
};

export default SidebarItem;
