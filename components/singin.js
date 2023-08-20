import { signIn } from "next-auth/react"
import { useRouter } from "next/router"
import React, { useState } from "react"

const SignInPage = () => {
    const [email, setEmail] = useState("admin@example.com")
    const [password, setPassword] = useState("@Password123")
    const [error, setError] = useState("")
    const router = useRouter()
    const callbackUrl = decodeURI(router.query?.callbackUrl ?? "/")

    console.log(callbackUrl)
    const handleSubmit = async e => {
        e.preventDefault()
        console.log("Logging in")
        const result = await signIn("credentials", {
            email,
            password,
            callbackUrl: callbackUrl ?? "/",
            redirect: false
        })
        if (result?.error) {
            setError(result.error)
        }
        if (result?.ok) {
            router.push(callbackUrl)
        }
    }
    return (
        <div className="w-full h-full">
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center card shadow-[0_0_6px_0px_rgba(0,0,0,35%)] rounded-md">
                    <form className="card-body w-96 p-5 " onSubmit={handleSubmit}>
                        <h1 className="text-4xl my-8">Sign In</h1>
                        {!!error && <p className="text-error">ERROR: {error}</p>}
                        <input
                            type="text"
                            className="input input-bordered"
                            placeholder="email"
                            value={email}
                            onChange={e => {
                                setEmail(e.target.value)
                            }}
                        />
                        <input
                            type="password"
                            className="input input-bordered"
                            placeholder="password"
                            value={password}
                            onChange={e => {
                                setPassword(e.target.value)
                            }}
                        />
                        <button className="btn border-[1px] border-gray-300 rounded-sm" type="submit">
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignInPage
