import AppLayout from "@/layouts/appLayout";
import React from "react";
import { Button, Input } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import InputPassword from "@/components/InputPassword";
import { useSelector } from "react-redux";

export default function AccountPage() {
    const { user } = useSelector((state: any) => state.auth);

    const validationSchema = Yup.object().shape({
        username: Yup.string().required("Username is required"),
        password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .max(24, "Password is too long, maximum 24 characters")
            .required("Password is required"),
        newPassword: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .max(24, "Password is too long, maximum 24 characters"),
        confirmNewPassword: Yup.string().oneOf(
            [Yup.ref("password")],
            "Passwords must match"
        ),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register: registerForm,
        handleSubmit,
        reset: formReset,
        formState,
    } = useForm(formOptions);
    const { errors } = formState;

    const onSubmit = async (data: any) => { };

    return (
        <AppLayout>
            <div className="w-full min-h-[1000px] px-6 pt-5 mobile:px-4 ">
                <h1 className="text-[70px] text-white mb-5 px-2 mobile:px-0 mobile:text-[40px]">
                    Account
                </h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="max-w-xs flex flex-col gap-3"
                >
                    <Input
                        variant="bordered"
                        label="Your name"
                        type="text"
                        {...registerForm("username")}
                        errorMessage={errors.username?.message}
                    />
                    <InputPassword
                        label="New Password"
                        register={registerForm("newPassword")}
                        errorMessage={errors.newPassword?.message}
                    />
                    <InputPassword
                        label="Retype New Password"
                        register={registerForm("confirmNewPassword")}
                        errorMessage={errors.confirmNewPassword?.message}
                    />
                    <InputPassword
                        label="Password"
                        register={registerForm("password")}
                        errorMessage={errors.password?.message}
                    />
                    <Button
                        type="submit"
                        className="tracking-wider bg-[#2bb540] uppercase font-bold"
                    >
                        Change
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
