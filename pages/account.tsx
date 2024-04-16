import AppLayout from "@/layouts/appLayout";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import InputPassword from "@/components/InputPassword";
import axios from "axios";
import API_URL from "@/config/apiUrl";
import { toast } from "react-toastify";
import { updateUser } from "@/stores/auth/authSlice";
import { useDispatch } from "react-redux";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Avatar,
    useDisclosure,
    Divider,
} from "@nextui-org/react";
import { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";

const AccountPage: NextPage = () => {
    const dispatch = useDispatch<any>();
    const { data: session, status } = useSession();

    const [avatar, setAvatar] = useState<string>(session?.user?.image_link || "");
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [token, setToken] = useState();

    const loginSchema = Yup.object().shape({
        password: Yup.string()
            .required("Password is required")
            .min(8, "Password must be at least 8 characters")
            .max(24, "Password is too long, maximum 24 characters"),
    });

    const updateSchema = Yup.object().shape({
        username: Yup.string().required("Username is required"),
        image_link: Yup.string().required("Avatar link is required"),
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

    const loginFormOptions = { resolver: yupResolver(loginSchema) };
    const updateFormOptions = { resolver: yupResolver(updateSchema) };

    const {
        register: registerLoginForm,
        handleSubmit: handleSubmitLogin,
        reset: formResetLogin,
        formState: fomrStateLogin,
    } = useForm(loginFormOptions);

    const {
        register: registerUpdateForm,
        handleSubmit: handleSubmitUpdate,
        reset: formReset,
        formState: formStateUpdate,
    } = useForm(updateFormOptions);

    const onSubmitLogin = async (data: any) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email: session?.user.email,
                password: data.password,
            });
            setToken(response.data.token);

            toast.success("Login sucesss");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    };

    const onSubmitUpdate = async (data: any) => {
        try {
            let update = {};

            if (data.newPassword) {
                update = { ...update, password: data.newPassword };
            }

            if (data.username && data.username != session?.user.name) {
                update = { ...update, name: data.username };
            }

            if (data.image_link && data.image_link != session?.user.image_link) {
                update = { ...update, image_link: data.image_link };
            }

            if (Object.keys(update).length === 0) {
                toast.info("Nothing has been changed");
                return;
            }

            await axios.put(`${API_URL}/users/${session?.user.id}`, update, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            dispatch(updateUser(update));

            toast.success("Account has been updated");
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    };

    const onDeleteAccount = async () => {
        try {
            await axios.delete(`${API_URL}/user/${session?.user.id}`, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            signOut();
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    };

    if (!token) {
        return (
            <AppLayout>
                <div className="w-full min-h-[1000px] px-6 pt-5 mobile:px-4 ">
                    <h1 className="text-[70px] text-white mb-5 px-2 mobile:px-0 mobile:text-[40px]">
                        Account
                    </h1>
                    <form
                        onSubmit={handleSubmitLogin(onSubmitLogin)}
                        className="flex flex-col gap-3"
                    >
                        <div className="max-w-xs">
                            <Avatar
                                isBordered
                                className="w-[120px] h-[120px] mb-5"
                                src={avatar}
                            />
                        </div>

                        <h3>Login before update account: </h3>
                        <div className="max-w-xs flex flex-col gap-3">
                            <InputPassword
                                label="Password"
                                register={registerLoginForm("password")}
                                errorMessage={
                                    fomrStateLogin.errors.password?.message
                                }
                            />
                            <Button
                                type="submit"
                                className="tracking-wider bg-[#2bb540] uppercase font-bold"
                            >
                                Login
                            </Button>
                        </div>
                    </form>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="w-full min-h-[1000px] px-6 pt-5 mobile:px-4 ">
                <h1 className="text-[70px] text-white mb-5 px-2 mobile:px-0 mobile:text-[40px]">
                    Account
                </h1>
                <form
                    onSubmit={handleSubmitUpdate(onSubmitUpdate)}
                    className="flex flex-col gap-3"
                >
                    <div className="max-w-xs mb-8">
                        <Avatar
                            isBordered
                            className="w-[120px] h-[120px] mb-5"
                            src={avatar}
                        />
                        <Input
                            variant="bordered"
                            type="text"
                            {...registerUpdateForm("image_link")}
                            errorMessage={
                                formStateUpdate.errors.image_link?.message
                            }
                            value={avatar}
                            label="Avatar link"
                            onChange={(e) => {
                                setAvatar(e.target.value);
                            }}
                        />
                    </div>

                    <div className="max-w-xs flex flex-col gap-3">
                        <Input
                            variant="bordered"
                            label="Your name"
                            type="text"
                            defaultValue={session?.user?.name}
                            {...registerUpdateForm("username")}
                            errorMessage={
                                formStateUpdate.errors.username?.message
                            }
                        />
                        <InputPassword
                            label="New Password"
                            {...registerUpdateForm("newPassword")}
                            errorMessage={
                                formStateUpdate.errors.newPassword?.message
                            }
                        />
                        <InputPassword
                            label="Retype New Password"
                            {...registerUpdateForm("confirmNewPassword")}
                            errorMessage={
                                formStateUpdate.errors.confirmNewPassword
                                    ?.message
                            }
                        />
                        <Button
                            type="submit"
                            className="tracking-wider bg-[#2bb540] uppercase font-bold"
                        >
                            Update Account
                        </Button>
                        <Divider />
                        <h3 className="tracking-wider font-bold uppercase mt-5">
                            DANGER ZONE
                        </h3>
                        <Button
                            onPress={onOpen}
                            color="danger"
                            className="tracking-wider uppercase font-bold"
                        >
                            Delete Account
                        </Button>
                    </div>
                </form>
            </div>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="text-danger flex flex-col gap-1">
                                Delete Account
                            </ModalHeader>
                            <ModalBody>
                                Are you sure you want to delete your account?
                                This action cannot be undone and will
                                permanently remove all your account information.
                                Please think carefully before proceeding.
                            </ModalBody>
                            <ModalFooter>
                                <Button onPress={onClose}>Cancle</Button>
                                <Button
                                    color="danger"
                                    onPress={onDeleteAccount}
                                >
                                    Delete
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </AppLayout>
    );
};
export default AccountPage;
