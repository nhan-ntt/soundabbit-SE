"use client";

import React from "react";

import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";
import { ThemeProviderProps } from "next-themes/dist/types";
import store from "@/stores/store";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemeProvider } from "next-themes";

import { useRouter } from "next/navigation";

export interface ProvidersProps {
    children: React.ReactNode;
    themeProps?: ThemeProviderProps;
}

function Provider({ children, themeProps }: ProvidersProps) {
    const router = useRouter();

    return (
        <NextUIProvider navigate={router.push}>
            <SessionProvider>
                <ReduxProvider store={store}>
                    <NextThemeProvider attribute="class" defaultTheme="dark" {...themeProps}>{children}</NextThemeProvider>
                </ReduxProvider >
            </SessionProvider>
        </NextUIProvider>
    );
}

export default Provider;

