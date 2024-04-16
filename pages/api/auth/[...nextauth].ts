import API_URL from "@/config/apiUrl";
import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
    pages: {
        signIn: '/login',
        error: '/login',
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials, req) {
                try {
                    const res = await axios.post(`${API_URL}/auth/login`, {
                        email: credentials?.email,
                        password: credentials?.password,
                    });
                    console.log({ res });

                    if (res.data) {
                        return res.data
                    }
                } catch (error: any) {
                    console.log({ error });
                    if (error.response) {
                        throw {
                            status: error.request.status,
                            success: error.response.data.success,
                            message: error.response.data.message,
                        };
                    }

                    throw error;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return { ...token, ...user };
            }
            return token
        },
        async session({ session, token, user }) {
            session.user = { ...session.user, ...token };
            return session;
        },
    },
});
