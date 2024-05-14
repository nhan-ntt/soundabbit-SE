import React from "react";
import {
    Navbar as NavbarNextui,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
} from "@nextui-org/react";
import Navigation from "@/components/Navigation";
import Account from "@/components/Account";

export default function Navbar() {
    return (
        <NavbarNextui maxWidth="full">
            <NavbarContent justify="center">
                <NavbarItem>
                    <Navigation />
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <Account />
                </NavbarItem>
            </NavbarContent>
        </NavbarNextui>
    );
}
