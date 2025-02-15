'use client';

import { useState } from 'react';
import {useAuth, useSignUp} from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {Button} from "@/components/Button";
import Link from "next/link";

export function SignUpForm() {
    const { isSignedIn } = useAuth();
    const { isLoaded, signUp, setActive } = useSignUp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [subdomain, setSubdomain] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    if (isSignedIn){
        return (
            <div className="mt-5">
                <Link href="/dashboard"><Button>Go to Dashboard ➡️</Button></Link>
            </div>
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        try {
            // Check if subdomain is available
            const checkResponse = await fetch('/api/check-subdomain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subdomain }),
            });

            if (!checkResponse.ok) {
                setError('Subdomain not available');
                return;
            }

            // Create Clerk user
            await signUp.create({
                emailAddress: email,
                password,
            });

            // Send verification email
            await signUp.prepareEmailAddressVerification({
                strategy: 'email_code',
            });

            setVerifying(true)
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isLoaded) return

        try {
            // Use the code the user provided to attempt verification
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            console.log({completeSignUp})

            if (completeSignUp.status !== 'complete') {
                console.error(JSON.stringify(completeSignUp, null, 2))
                throw Error('Error completing signup');
            }
            // Verification complete!
            await setActive({ session: completeSignUp.createdSessionId })

            // Create subdomain record
            const createResponse = await fetch('/api/create-subdomain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subdomain,
                    userId: completeSignUp.createdUserId
                }),
            });

            if (createResponse.ok) {
                router.push('/dashboard')
            } else {
                console.error('Error creating subdomain: ', createResponse.json())
            }

        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error('Error:', JSON.stringify(err, null, 2))
        }
    }

    const inputClassName = "w-full px-4 py-2 bg-white/10 rounded-lg border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all";
    const labelClassName = "block text-sm font-medium text-gray-300 mb-1";

    if (verifying) {
        return (
            <div className="flex flex-col items-center justify-center text-white p-4">
                <form onSubmit={handleVerify} className="flex flex-col w-full max-w-md space-y-4">
                    <label htmlFor="code" className="text-lg">
                        Enter your email verification code
                    </label>
                    <input
                        value={code}
                        id="code"
                        name="code"
                        onChange={(e) => setCode(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        placeholder="Enter code"
                    />
                    <button
                        type="submit"
                        className="cursor-pointer w-full px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white font-medium rounded-lg transition-colors"
                    >
                        Verify
                    </button>
                </form>
            </div>
        )
    }


    return (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6 max-w-md">
            <div>
                <label htmlFor="email" className={labelClassName}>Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClassName}
                    placeholder="you@example.com"
                    required
                />
            </div>

            <div>
                <label htmlFor="password" className={labelClassName}>Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClassName}
                    placeholder="••••••••"
                    required
                />
            </div>

            <div>
                <label htmlFor="subdomain" className={labelClassName}>Subdomain</label>
                <div className="flex items-center">
                    <input
                        id="subdomain"
                        type="text"
                        value={subdomain}
                        onChange={(e) => setSubdomain(e.target.value)}
                        className={`${inputClassName} rounded-r-none`}
                        placeholder="your-project"
                        required
                    />
                    <span className="px-4 py-2 bg-white/5 border border-l-0 border-white/20 text-gray-400 rounded-r-lg">
            .changelog.community
          </span>
                </div>
            </div>

            {error && (
                <p className="text-red-400 text-sm">{error}</p>
            )}

            {/* CAPTCHA Widget */}
            <div id="clerk-captcha"></div>

            <button
                type="submit"
                className="cursor-pointer w-full px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white font-medium rounded-lg transition-colors"
            >
                Sign Up
            </button>
            <div className="mt-4 text-center text-gray-400">
                Already have an account?{' '}
                <Link href="/sign-in" className="text-sky-400 hover:text-sky-300 transition-colors">
                    Sign in
                </Link>
            </div>
        </form>

    );
}

// import { useId } from 'react'
// import { Button } from '@/components/Button'
//
// export function SignUpForm() {
//   let id = useId()
//
//   return (
//     <form className="relative isolate mt-8 flex items-center pr-1">
//       <label htmlFor={id} className="sr-only">
//         Email address
//       </label>
//       <input
//         required
//         type="email"
//         autoComplete="email"
//         name="email"
//         id={id}
//         placeholder="Email address"
//         className="peer w-0 flex-auto bg-transparent px-4 py-2.5 text-base text-white placeholder:text-gray-500 focus:outline-hidden sm:text-[0.8125rem]/6"
//       />
//       <Button type="submit" arrow>
//         Get updates
//       </Button>
//       <div className="absolute inset-0 -z-10 rounded-lg transition peer-focus:ring-4 peer-focus:ring-sky-300/15" />
//       <div className="absolute inset-0 -z-10 rounded-lg bg-white/2.5 ring-1 ring-white/15 transition peer-focus:ring-sky-300" />
//     </form>
//   )
// }
