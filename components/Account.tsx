import React from "react";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Avatar,
    DropdownSection,
} from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { resetState } from "@/stores/action";
import { signOut, useSession } from "next-auth/react";

export default function Account() {
    const dispatch = useDispatch<any>();
    const { data: session, status } = useSession();

    const router = useRouter();

    const onLogout = () => {
        dispatch(resetState());
        signOut();
    };

    return (
        <Dropdown placement="bottom-end">
            <DropdownTrigger>
                <Avatar
                    as="button"
                    size="sm"
                    isBordered
                    src={session?.user.image_link}
                />
            </DropdownTrigger>

            <DropdownMenu>
                <DropdownSection content="test" showDivider>
                    <DropdownItem onClick={() => router.push("/account")}>
                        Account
                    </DropdownItem>
                </DropdownSection>
                <DropdownItem onClick={onLogout}>Log out</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}
