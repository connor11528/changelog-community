'use client';

import React from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Bell } from 'lucide-react';

const DashboardNav = () => {
    const { user, isLoaded } = useUser();

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center h-16">
                    {/* Left side - Logo and navigation */}
                    <div className="flex items-center">
                        <Link href="/dashboard" className="flex items-center">
                            <span className="text-lg font-bold text-gray-900">changelog.community</span>
                        </Link>

                        <div className="hidden md:flex ml-10 space-x-8">
                            {/*<Link*/}
                            {/*    href="/dashboard"*/}
                            {/*    className="flex items-center text-gray-600 hover:text-gray-900"*/}
                            {/*>*/}
                            {/*    <Home className="w-4 h-4 mr-2" />*/}
                            {/*    Home*/}
                            {/*</Link>*/}
                            {/*<Link*/}
                            {/*    href="/dashboard/settings"*/}
                            {/*    className="flex items-center text-gray-600 hover:text-gray-900"*/}
                            {/*>*/}
                            {/*    <Settings className="w-4 h-4 mr-2" />*/}
                            {/*    Settings*/}
                            {/*</Link>*/}
                        </div>
                    </div>

                    {/* Right side - Notifications and User menu */}
                    <div className="flex items-center space-x-6">
                        <button className="text-gray-600 hover:text-gray-900">
                            <Bell className="w-5 h-5" />
                        </button>

                        {isLoaded && user && (
                            <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {user.firstName || user.emailAddresses[0]?.emailAddress}
                </span>
                                <UserButton
                                    afterSignOutUrl="/"
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-8 h-8"
                                        }
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default DashboardNav;