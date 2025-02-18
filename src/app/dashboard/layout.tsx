import { ReactNode } from 'react';
import DashboardNav from "@/components/DashboardNav";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNav />

            <main className="flex-1 p-4 pt-20">
                <div className="mx-auto max-w-7xl">
                    {children}
                </div>
            </main>
        </div>
    );
}