import React, { useState } from "react";
import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { Button, Image, Link, Input, Card } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import InputPassword from "@/components/InputPassword";
import axios from "axios";
import { API } from "@/config/api";

const Register: NextPage = () => {
    const router = useRouter();

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const validationSchema = Yup.object().shape({
        username: Yup.string().required("Username is required"),

        password: Yup.string()
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


    const onSubmit = async (data: any) => {
        try {
            setLoading(true)

            await axios.post(API.register, {
                name: data.username,
                username: data.username,
                password: data.password,
                image_link: null,
            })
            router.push("/login");
        } catch (error: any) {
            if (error?.response) {
                setMessage(error.response.data.message)
            }
        } finally {
            setLoading(false)
        }
    };

    const onChange = () => {
        setMessage('');
    }

    return (
        <div className=" text-white bg-[#000000]">
            <div
                className="bg-[url('https://images.unsplash.com/photo-1596300919357-77dbd158c7b8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80')] 
        h-screen w-screen bg-no-repeat bg-cover"
            >
                <div
                    className="h-screen w-screen bg-gradient-to-t
         from-black to-[#00000086] flex
          justify-center items-center"
                >
                    <Card
                        className="select-none px-20 mobile:pt-8 mobile:pb-10 pt-14 pb-16 mini-laptop:px-10 tablet:px-10 mobile:px-6 
          flex flex-col items-center bg-black/90 rounded-xl"
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
                                SOUNDABBIT
                            </h1>
                        </div>

                        <h1 className="mobile:text-xl text-3xl w-80 mobile:w-64 mobile:text-center mt-10 mb-10 font-extrabold ">
                            Download & listen free music lifetime.
                        </h1>

                        {message && (
                            <p
                                className="bg-red-500 border border-red-800 
              bg-opacity-40 px-3 mt-6 mb-4 py-2 rounded-3xl  w-full text-center"
                            >
                                {message}
                            </p>
                        )}
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            onChange={onChange}
                            className="flex flex-col gap-5"
                        >
                            <Input
                                label="Your name"
                                type="text"
                                variant="bordered"
                                errorMessage={errors.username?.message}
                                {...registerForm("username")}
                                className="w-80 mobile:w-64"
                            />
                            <Input
                                label="Username"
                                type="text"
                                variant="bordered"
                                errorMessage={errors.username?.message}
                                {...registerForm("username")}
                                className="w-80 mobile:w-64"
                            />
                            <InputPassword
                                label="Password"
                                register={registerForm("password")}
                                errorMessage={errors.password?.message}
                            />
                            <InputPassword
                                label="Confirm Password"
                                register={registerForm("confirmPassword")}
                                errorMessage={errors.confirmPassword?.message}
                            />

                            <Button
                                disabled={loading}
                                className="tracking-wider bg-[#2bb540] uppercase font-bold"
                                type="submit"
                            >
                                {loading ? (
                                    <span className="inline-loader"></span>
                                ) : (
                                    <div>Register</div>
                                )}
                            </Button>
                            <p>
                                Already have an account?{" "}
                                <Link href="/login" className="text-[#2bb540]">
                                    Login
                                </Link>
                            </p>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Register;
