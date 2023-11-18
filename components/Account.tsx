import React from "react";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
    Avatar,
    DropdownSection,
} from "@nextui-org/react";
import { reset } from "../stores/auth/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

export default function Account() {
    const dispatch = useDispatch<any>();
    const router = useRouter();

    const logout = () => {
        dispatch(reset());
    };

    return (
        <Dropdown placement="bottom-end">
            <DropdownTrigger>
                <Avatar
                    as="button"
                    size="sm"
                    isBordered
                    src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                />
            </DropdownTrigger>

            <DropdownMenu>
                <DropdownSection content="test" showDivider>
                    <DropdownItem onClick={()=> router.push("/account")}>Account</DropdownItem>
                    <DropdownItem>Settings</DropdownItem>
                </DropdownSection>
                <DropdownItem onClick={logout}>Log out</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}
