import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";
import {MongoDBAdapter} from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import users from "@/lib/users.json";
// import {request} from "axios";
if (!process.env.NEXTAUTH_SECRET) {
    throw new Error(
        "please provide process.env.NEXTAUTH_SECRET environment variable"
    );
}
const adminEmails = ['seyedmahmoodhosseini@gmail.com', 'samisalazar786@gmail.com'];
export const authOptions = {
    providers: [
        // OAuth authentication providers...
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        }),
        CredentialsProvider({
            name: "Credentials",
            id: "credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const user = users.find((user) => {
                    return (
                        credentials?.email === user.email &&
                        credentials.password === user.password
                    );
                });

                if (!user) {
                    throw new Error("Invalid email or password");
                }
                return user;
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    adapter: MongoDBAdapter(clientPromise),
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        session({ session, token }) {
            console.log("session", session);
            if (token && session.user) {
                session.user.role = token.role;
            }
            return session;
        },
    },
};
export default NextAuth(authOptions);

// export const isAdminRequest = async (req, res) => {
//     const session = await getServerSession(req, res, authOptions);
// console.log(session);
//     if (!adminEmails.includes(session?.user?.email)){
//         res.status(401);
//         res.end();
//         throw 'not an admin';
//     }
// }


{/*

import NextAuth, {getServerSession} from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import {MongoDBAdapter} from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
// import {request} from "axios";

const adminEmails = ['seyedmahmoodhosseini@gmail.com', 'samisalazar786@gmail.com'];
export const authOptions = {
    providers: [
        // OAuth authentication providers...
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    callbacks: {
        session: ({session, token, user}) => {
            if (adminEmails.includes(session?.user?.email)) {
                return session;
            } else {
                return false;
            }
        }
    }
};
export default NextAuth(authOptions);

export const isAdminRequest = async (req, res) => {
    const session = await getServerSession(req, res, authOptions);

    if (!adminEmails.includes(session?.user?.email)){
        res.status(401);
        res.end();
        throw 'not an admin';
    }
}

 */}