import React from "react";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Avatar,
    DropdownSection,
} from "@nextui-org/react";
import { logout } from "@/stores/auth/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { resetState } from "@/stores/action";
import { useSelector } from "react-redux";

export default function Account() {
    const dispatch = useDispatch<any>();
    const { user } = useSelector((state: any) => state.auth);

    const router = useRouter();

    const onLogout = () => {
        dispatch(resetState());
        dispatch(logout());
    };

    return (
        <Dropdown placement="bottom-end">
            <DropdownTrigger>
                <Avatar
                    as="button"
                    size="sm"
                    isBordered
                    src={user.image_link}
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
