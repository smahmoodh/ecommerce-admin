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
                <div className='flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden'>
                    <img
                        src={session?.user.image}
                        className="w-6 h-6"
                        alt="profile"
                    />
                    <span className="px-2">
                        {session?.user.name}
                    </span>

                </div>
            </div>
        </Layout>
    )
}
