import AppLayout from "@/layouts/appLayout";
import React from "react";

export default function AccountPage() {
    return (
        <AppLayout title="Your Library" color="#2bb540">
            <div className="w-full min-h-[1000px] px-6 pt-5 mobile:px-4 ">
                <h1 className="text-[70px] font-ProximaBold text-white mb-5 px-2 mobile:px-0 mobile:text-[40px]">
                    Account
                </h1>
            </div>
        </AppLayout>
    );
}
