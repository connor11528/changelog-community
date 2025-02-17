import React from 'react';
import Image from 'next/image'
import Link from 'next/link';

interface Entry {
    // slug: string;
    createdAt: Date;
    title: string;
    content: string;
}

interface EntryCardProps {
    entry: Entry;
}


export default function EntryCard({entry}: EntryCardProps) {
    return (
        <div className="grid py-20 md:grid-cols-4 md:px-5 xl:px-0">
            <div className="sticky top-20 hidden self-start md:col-span-1 md:block">
                {/*<Link href={entry.slug}>*/}
                <time dateTime={entry.createdAt.toISOString()}
                      className="text-neutral-500 transition-colors hover:text-neutral-800">
                    {new Date(entry.createdAt).toLocaleDateString()}
                </time>
                {/*</Link>*/}
            </div>
            <div className="flex flex-col gap-6 md:col-span-3">
                {/*<Link href={entry.slug}>*/}
                <Image alt="UTM support in Dub Analytics" width="2400" height="1260"
                       className="blur-0 aspect-video border border-neutral-200 object-cover md:rounded-2xl"
                       src="https://assets.dub.co/cms/utm-analytics.jpg"/>
                {/*</Link>*/}
                {/*<Link className="group mx-5 flex items-center space-x-3 md:mx-0" href={entry.slug}>*/}
                <time dateTime={entry.createdAt.toISOString()}
                      className="text-sm text-neutral-500 transition-all group-hover:text-neutral-800 md:hidden">
                    {new Date(entry.createdAt).toLocaleDateString()}
                </time>
                {/*</Link>*/}
                {/*    <Link className="mx-5 md:mx-0" href={entry.slug}>*/}
                <h2
                    className="font-display text-2xl font-medium tracking-tight text-neutral-800 hover:underline hover:decoration-1 hover:underline-offset-4 md:text-3xl">
                    {entry.title}
                </h2>
                {/*</Link>*/}
                <article
                    className="prose prose-gray max-w-none transition-all prose-headings:relative prose-headings:scroll-mt-20 prose-headings:font-display prose-a:font-medium prose-a:text-gray-500 prose-a:underline-offset-4 hover:prose-a:text-black prose-thead:text-lg mx-5 md:mx-0">
                    {entry.content}
                </article>
            </div>
        </div>
    )
}