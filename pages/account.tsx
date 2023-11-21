import AppLayout from "@/layouts/appLayout";
import React from "react";
import { Button, Input } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import InputPassword from "@/components/InputPassword";
import { useSelector } from "react-redux";
import axios from "axios";
import API_URL from "@/config/apiUrl";
import { toast } from "react-toastify";
import { updateUsername } from "@/stores/auth/authSlice";
import { useDispatch } from "react-redux";

export default function AccountPage() {
    const dispatch = useDispatch<any>();
    const { user } = useSelector((state: any) => state.auth);

    const validationSchema = Yup.object().shape({
        username: Yup.string().required("Username is required"),
        password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .max(24, "Password is too long, maximum 24 characters")
            .required("Password is required"),
        newPassword: Yup.string()
            .nullable()
            .transform((curr, orig) => (orig === "" ? null : curr))
            .min(8, "Password must be at least 8 characters")
            .max(24, "Password is too long, maximum 24 characters"),
        confirmNewPassword: Yup.string()
            .test(
                "match",
                "Confirm newPassword must match",
                function(confirmNewPassword) {
                    const { newPassword } = this.parent;
                    if (newPassword !== null && newPassword !== undefined) {
                        return confirmNewPassword === newPassword;
                    }
                    return true;
                }
            )
            .nullable(),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register: registerForm,
        handleSubmit,
        reset: formReset,
        formState,
    } = useForm(formOptions);
    const { errors } = formState;

    const onSubmit = async (data: any) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email: user.email,
                password: data.password,
            });

            let update = {};

            if (data.newPassword) {
                update = { ...update, password: data.newPassword };
            }

            if (data.username != user.name) {
                update = { ...update, name: data.username };
                dispatch(updateUsername(data.username));
            }

            await axios.put(`${API_URL}/users/${user.id}`, update, {
                headers: {
                    authorization: `Bearer ${response.data.token}`,
                },
            });

            toast.success("Account has been updated");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    };

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
                        defaultValue={user?.name}
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
