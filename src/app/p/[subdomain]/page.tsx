import {notFound} from 'next/navigation'
import {prisma} from '@/lib/prisma';
import EntryCard from "@/components/EntryCard";
import Link from "next/link";

export default async function ChangelogPage({
                                                params: {subdomain}
                                            }: {
    params: { subdomain: string }
}) {
    // Fetch project and entries
    const project = await prisma.project.findUnique({
        where: {subdomain},
        include: {
            entries: {
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    })

    if (!project) {
        notFound()
    }

    return (
        <div className="relative">
            <div className="mx-auto w-full px-3 relative max-w-screen-lg lg:px-4 xl:px-0">
                <svg
                    className="pointer-events-none absolute inset-[unset] left-1/2 top-0 w-[1200px] -translate-x-1/2 text-neutral-300 [mask-image:radial-gradient(70%_60%_at_50%_60%,black_30%,transparent)] max-sm:opacity-50"
                    width="100%" height="100%">
                    <defs>
                        <pattern id="grid-:r6:" x="-1" y="27" width="80" height="80" patternUnits="userSpaceOnUse">
                            <path d="M 80 0 L 0 0 0 80" fill="transparent" stroke="currentColor"
                                  strokeWidth="1"></path>
                        </pattern>
                    </defs>
                    <rect fill="url(#grid-:r6:)" width="100%" height="100%"></rect>
                </svg>
                <div className="relative flex flex-col gap-8 py-16">
                    <div><h1
                        className="mt-5 font-display text-4xl font-medium text-neutral-900 sm:text-5xl sm:leading-[1.15] text-left">
                        {subdomain} changelog
                    </h1>
                        <p className="mt-5 text-neutral-500 sm:text-lg">All the latest updates, improvements, and fixes
                            to {subdomain}</p></div>
                    <div className="flex w-fit items-center space-x-2">
                        <Link target="_blank"
                              className="rounded-full mx-auto max-w-fit border py-2 text-sm font-medium shadow-sm transition-all hover:ring-4 hover:ring-gray-200 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:ring-0 disabled:border-gray-200 border-gray-200 bg-white hover:border-gray-400 hover:text-gray-800 text-gray-500 px-2"
                              href="">
                            <svg width="300" height="300" viewBox="0 0 300 300" version="1.1"
                                 xmlns="http://www.w3.org/2000/svg" className="p-px h-3 w-3">
                                <path stroke="currentColor"
                                      d="M178.57 127.15 290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59h89.34M36.01 19.54H76.66l187.13 262.13h-40.66"></path>
                            </svg>
                        </Link>
                        <Link
                            className="rounded-full mx-auto max-w-fit border py-2 text-sm font-medium shadow-sm transition-all hover:ring-4 hover:ring-gray-200 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:ring-0 disabled:border-gray-200 border-gray-200 bg-white hover:border-gray-400 hover:text-gray-800 text-gray-500 px-2"
                            href="">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                 className="lucide lucide-rss h-3 w-3 text-neutral-500">
                                <path d="M4 11a9 9 0 0 1 9 9"></path>
                                <path d="M4 4a16 16 0 0 1 16 16"></path>
                                <circle cx="5" cy="19" r="1"></circle>
                            </svg>
                        </Link><p className="text-sm text-neutral-500 pl-3">Subscribe for updates</p></div>
                </div>
            </div>

            <div className="mx-auto w-full px-3 max-w-screen-lg lg:px-4 xl:px-0">
                {project.entries.map((entry) => (
                    <EntryCard entry={entry} key={entry.id}/>
                ))}
            </div>
        </div>
    )
}