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
        async signIn({ user, account, profile, email, credentials }) {
            return true
        },
        async redirect({ url, baseUrl }) {
            return baseUrl
        },
        async session({ session, token, user }) {
            return session
        },
        async jwt({ token }) {
            token.userRole = "admin"
            return token
        },
    }
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