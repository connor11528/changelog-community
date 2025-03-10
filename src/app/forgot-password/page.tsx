'use client'
import React, { useEffect, useState } from 'react'
import { useAuth, useSignIn } from '@clerk/nextjs'
import type { NextPage } from 'next'
import { useRouter } from 'next/navigation'

const ForgotPasswordPage: NextPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [code, setCode] = useState('')
    const [successfulCreation, setSuccessfulCreation] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const { isSignedIn } = useAuth()
    const { isLoaded, signIn, setActive } = useSignIn()

    useEffect(() => {
        if (isSignedIn) {
            router.push('/dashboard')
        }
    }, [isSignedIn, router])

    if (!isLoaded) {
        return null
    }

    // Send the password reset code to the user's email
    async function create(e: React.FormEvent) {
        e.preventDefault()
        await signIn
            ?.create({
                strategy: 'reset_password_email_code',
                identifier: email,
            })
            .then((_) => {
                setSuccessfulCreation(true)
                setError('')
            })
            .catch((err) => {
                console.error('error', err.errors[0].longMessage)
                setError(err.errors[0].longMessage)
            })
    }

    // Reset the user's password.
    // Upon successful reset, the user will be
    // signed in and redirected to the home page
    async function reset(e: React.FormEvent) {
        e.preventDefault()
        await signIn
            ?.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code,
                password,
            })
            .then((result) => {
                if (result.status === 'complete') {
                    // Set the active session to
                    // the newly created session (user is now signed in)
                    setActive({ session: result.createdSessionId })
                    setError('')
                } else {
                    console.log(result)
                }
            })
            .catch((err) => {
                console.error('error', err.errors[0].longMessage)
                setError(err.errors[0].longMessage)
            })
    }

    return (
        <div className="relative bg-[#020817] overflow-hidden">
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
                <div className="mb-8 text-center">
                    <h1 className="text-5xl font-bold text-white mb-4">Forgot Password?</h1>
                    <p className="text-lg text-gray-400">We will send you an email to reset your password.</p>
                </div>

                <div className="w-full max-w-md">
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/10">
                        <form onSubmit={!successfulCreation ? create : reset}>
                            {!successfulCreation && (
                                <>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-3">
                                        Provide
                                        your email address</label>

                                    <div className="mb-3 text-white">
                                        <input
                                            type="email"
                                            placeholder="e.g john@doe.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3 mb-8 bg-white/10 rounded-lg border border-white/20 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                                        />
                                    </div>


                                    <button
                                        type="submit"
                                        className="w-full px-4 py-3 bg-sky-500 hover:bg-sky-400 text-white font-medium rounded-lg transition-colors cursor-pointer"
                                    >
                                        Send password reset code
                                    </button>
                                    {error && <p>{error}</p>}
                                </>
                            )}

                            {successfulCreation && (
                                <div className="text-white">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-3">
                                        Enter your new password
                                    </label>
                                    <div className="mb-3">
                                        <input type="password"
                                               value={password}
                                               onChange={(e) => setPassword(e.target.value)}
                                               className="w-full px-4 py-3 mb-8 bg-white/10 rounded-lg border border-white/20 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"/>
                                    </div>

                                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-3">
                                        Enter the password reset code that was sent to your email
                                    </label>
                                    <div className="mb-3">
                                        <input type="code"
                                               value={code}
                                               onChange={(e) => setCode(e.target.value)}
                                               className="w-full px-4 py-3 mb-8 bg-white/10 rounded-lg border border-white/20 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all" />
                                    </div>
                                    <button className="w-full px-4 py-3 bg-sky-500 hover:bg-sky-400 text-white font-medium rounded-lg transition-colors cursor-pointer">Reset</button>
                                    {error && <p>{error}</p>}
                                </div>
                            )}
                        </form>

                    </div>
                </div>
            </div>

        </div>
    )
}

export default ForgotPasswordPage