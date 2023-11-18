import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import Head from "next/head";
import {Image} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { register, AuthStatus, reset } from "../stores/auth/authSlice";
import { useEffect } from "react";

const Register: NextPage = () => {
    const { status, user, message } = useSelector((state: any) => state.auth);
    const validationSchema = Yup.object().shape({
        username: Yup.string().required("Username is required"),
        email: Yup.string()
            .required("Email is required")
            .email("Email is invalid"),
        password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .max(24, "Password is too long, maximum 24 characters")
            .required("Password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Passwords must match")
            .required("Confirm Password is required"),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    const {
        register: registerForm,
        handleSubmit,
        reset: formReset,
        formState,
    } = useForm(formOptions);
    const { errors } = formState;

    const dispatch = useDispatch<any>();
    const router = useRouter();

    const onSubmit = async (data: any) => {
        const respone = await dispatch(
            register({
                name: data.username,
                email: data.email,
                password: data.password,
            })
        );

        if (respone.meta.requestStatus == "fulfilled") {
            router.push("/login");
        }
    };

    return (
        <div className="font-ProximaRegular text-white bg-[#000000]">
            <Head>
                <title>Rhyme - register</title>
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
              tracking-wider font-ProximaBold"
                            >
                                Rhyme
                            </h1>
                        </div>

                        <h1 className="mobile:text-xl text-3xl w-80 mobile:w-64 mobile:text-center mt-10 mb-8 font-extrabold font-ProximaBold">
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
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex flex-col">
                                <label
                                    htmlFor="username"
                                    className="font-ProximaRegular uppercase
                   text-gray-300 px-2 my-1 text-xs"
                                >
                                    Username
                                </label>
                                <input
                                    type="text"
                                    {...registerForm("username")}
                                    className="bg-[#3B3B3B] p-2 rounded-3xl 
                  border-none text-white outline-none 
                  px-4 py-2 mt-1  w-80 mobile:w-64"
                                />
                                <p
                                    className="text-sm font-ProximaRegular
                   font-thin text-red-600"
                                >
                                    {errors.username?.message}
                                </p>
                            </div>

                            <div className="flex flex-col">
                                <label
                                    htmlFor="email"
                                    className="font-ProximaRegular uppercase
                   text-gray-300 px-2 my-1 text-xs"
                                >
                                    Email
                                </label>
                                <input
                                    type="text"
                                    {...registerForm("email")}
                                    className="bg-[#3B3B3B] p-2 rounded-3xl 
                  border-none text-white outline-none 
                  px-4 py-2 mt-1  w-80 mobile:w-64"
                                />
                                <p
                                    className="text-sm font-ProximaRegular
                   font-thin text-red-600"
                                >
                                    {errors.email?.message}
                                </p>
                            </div>
                            <div className="flex-col flex">
                                <label
                                    htmlFor="password"
                                    className="font-ProximaRegular uppercase text-gray-300
                   px-2 my-1 text-xs"
                                >
                                    Password
                                </label>

                                <input
                                    type="password"
                                    {...registerForm("password")}
                                    className="bg-[#3B3B3B]  rounded-3xl border-none
                   text-white outline-none py-2 px-4 w-80 mt-1 mobile:w-64"
                                />
                                <p
                                    className="text-sm font-ProximaRegular
                   font-thin text-red-600 mt-2"
                                >
                                    {errors.password?.message}
                                </p>
                            </div>

                            <div className="flex-col flex">
                                <label
                                    htmlFor="password"
                                    className="font-ProximaRegular uppercase text-gray-300
                   px-2 my-1 text-xs"
                                >
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    {...registerForm("confirmPassword")}
                                    className="bg-[#3B3B3B]  rounded-3xl border-none
                   text-white outline-none py-2 px-4 w-80 mt-1 mobile:w-64"
                                />
                                <p
                                    className="text-sm font-ProximaRegular
                   font-thin text-red-600 mt-2"
                                >
                                    {errors.confirmPassword?.message}
                                </p>
                            </div>

                            <button
                                disabled={status == AuthStatus.Loading}
                                className="w-full mt-10  p-2 rounded-3xl bg-[#2bb540] font-ProximaBold
                uppercase hover:bg-[#289e39] disabled:hover:bg-opacity-20 disabled:bg-opacity-20 disabled:text-gray-300"
                                type="submit"
                            >
                                {status == AuthStatus.Loading ? (
                                    <span className="inline-loader"></span>
                                ) : (
                                    <div>register</div>
                                )}
                            </button>
                            <p
                                className="text-center mt-6 font-thin font-ProximaRegular
               text-gray-100 text-xs uppercase tracking-wider"
                            >
                                Already have an account?{" "}
                                <Link href="/login">
                                    <span className="cursor-pointer text-[#2bb540] font-ProximaBold tracking-widest">
                                        Login
                                    </span>
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
