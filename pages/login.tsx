import type { NextPage } from "next";
import React from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import Head from "next/head";
import { Button, Image, Link, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthStatus, login, reset } from "@/stores/auth/authSlice";
import InputPassword from "@/components/InputPassword";

const Login: NextPage = () => {
    const { status, user, message } = useSelector((state: any) => state.auth);
    const dispatch = useDispatch<any>();
    const router = useRouter();

    useEffect(() => {
        if (user || status == AuthStatus.Success) {
            router.push("/home");
        }
    }, [router, user, dispatch, status]);

    useEffect(() => {
        if (status == AuthStatus.Error) {
            dispatch(reset());
        }
    }, [router]);

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required("Email is required")
            .email("Email is invalid"),
        password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .max(24, "Password is too long, maximum 24 characters")
            .required("Password is required"),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register: registerForm,
        handleSubmit,
        reset,
        formState,
    } = useForm(formOptions);
    const { errors } = formState;

    const onSubmit = (data: any) => {
        dispatch(
            login({
                email: data.email,
                password: data.password,
            })
        );
    };

    return (
        <div className="font-ProximaRegular text-white bg-[#000000]">
            <Head>
                <title>Rhyme - login</title>
            </Head>
            <div
                className="bg-[url('https://images.unsplash.com/photo-1596300919357-77dbd158c7b8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80')] 
        h-screen w-screen bg-no-repeat bg-cover"
            >
                <div
                    className="h-screen w-screen bg-gradient-to-t
         from-black to-[#00000086] flex
          justify-center items-center"
                >
                    <div
                        className="select-none px-20 mobile:pt-8 mobile:pb-10 pt-14 pb-16 mini-laptop:px-10 tablet:px-10 mobile:px-6 
          flex flex-col items-center bg-black rounded-xl"
                    >
                        <div className="flex flex-row items-center">
                            <Image
                                src="/logo.jpeg"
                                width={40}
                                height={40}
                                alt="logo"
                            />
                            <h1
                                className="text-center uppercase mx-2 
              tracking-wider "
                            >
                                Rhyme
                            </h1>
                        </div>

                        <h1 className="mobile:text-xl text-3xl w-80 mb-10 mobile:w-64 mobile:text-center mt-10 font-extrabold ">
                            Download & listen free music lifetime.
                        </h1>
                        {status == AuthStatus.Error && (
                            <p
                                className="bg-red-500 border border-red-800 
              bg-opacity-40 px-3 mt-6 py-2 rounded-3xl  w-full text-center"
                            >
                                {message}
                            </p>
                        )}

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="flex flex-col gap-5"
                        >
                            <Input
                                label="Email"
                                type="text"
                                variant="bordered"
                                errorMessage={errors.email?.message}
                                {...registerForm("email")}
                                className="w-80 mobile:w-64"
                            />

                            <InputPassword
                                label="Password"
                                variant="bordered"
                                register={registerForm("password")}
                                errorMessage={errors.password?.message}
                            />

                            <Button
                                disabled={status == AuthStatus.Loading}
                                className="tracking-wider bg-[#2bb540] uppercase font-bold"
                                type="submit"
                            >
                                {status == AuthStatus.Loading ? (
                                    <span className="inline-loader"></span>
                                ) : (
                                    <div>Login</div>
                                )}
                            </Button>
                            <p>
                                Not have an account?{" "}
                                <Link
                                    href="/register"
                                    className="text-[#2bb540]"
                                >
                                    Register
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
