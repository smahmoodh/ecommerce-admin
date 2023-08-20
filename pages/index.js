import { useSession } from "next-auth/react";
import Layout from "@/components/Layout";
export default function Home() {
    const {data: session} = useSession();
    console.log({session});
    return(
        <Layout>
            <div className='text-blue-900 flex justify-between'>
                <h2 className="">
                    Hello, <b>{session?.user.name}</b>
                </h2>
                <div className='p-1 flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden'>
                    {session?.user.image ?
                        <img
                        src={session?.user.image}
                        className="w-6 h-6"
                        alt="profile"
                    />
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    }
                    <span className="px-2">
                        {session?.user.name}
                    </span>

                </div>
            </div>
        </Layout>
    )
}
