import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function SignInForm() {
    const { isLoaded, signIn, setActive } = useSignIn();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        try {
            const result = await signIn.create({
                identifier: email,
                password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                router.push("/dashboard");
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-300">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                    placeholder="you@example.com"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                    placeholder="••••••••"
                    required
                />
            </div>

            {error && (
                <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                    {error}
                </div>
            )}

            <button
                type="submit"
                className="w-full px-4 py-3 bg-sky-500 hover:bg-sky-400 text-white font-medium rounded-lg transition-colors"
            >
                Sign In
            </button>

            <div className="mt-5 text-center text-gray-400">
                Don&apos;t have an account?{' '}
                <Link href="/" className="text-sky-400 hover:text-sky-300 transition-colors font-medium">
                    Sign up
                </Link>
            </div>
            <div className="text-center text-gray-400">
                <Link href="/forgot-password" className="text-sky-400 hover:text-sky-300 transition-colors font-medium">
                    Forgot password
                </Link>
            </div>
        </form>
    );
}