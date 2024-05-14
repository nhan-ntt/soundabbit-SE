import NextAuth, { DefaultSession } from "next-auth";
import { User } from '../interfaces/user'

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: User;
    }
}

