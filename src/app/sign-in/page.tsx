'use client';
import { SignInForm } from '@/components/SignInForm';

export default function SignInPage() {
    return (
            <div className="relative bg-[#020817] overflow-hidden">
                {/* Stars background */}
                {/*<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">*/}
                {/*    <circle cx="10" cy="10" r="1" fill="white" opacity="0.5"/>*/}
                {/*    <circle cx="50" cy="30" r="0.8" fill="white" opacity="0.4"/>*/}
                {/*    <circle cx="90" cy="60" r="1.2" fill="white" opacity="0.6"/>*/}
                {/*</svg>*/}

                <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
                    <div className="mb-8 text-center">
                        <h1 className="text-5xl font-bold text-white mb-4">Welcome Back</h1>
                        <p className="text-lg text-gray-400">Sign in to your changelog dashboard</p>
                    </div>

                    <div className="w-full max-w-md">
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/10">
                            <SignInForm />
                        </div>
                    </div>
                </div>
            </div>
        );
}