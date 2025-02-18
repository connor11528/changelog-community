import React from 'react';
import Image from 'next/image'
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown'

interface Entry {
    createdAt: Date;
    title: string;
    content: string;
}

interface EntryCardProps {
    entry: Entry;
}

const CustomH1: Components['h1'] = ({node, children, ...props}) => (
    <h1 className="text-3xl font-bold text-gray-900 mb-6" {...props}>{children}</h1>
);

const CustomH2: Components['h2'] = ({node, children, ...props}) => (
    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4" {...props}>{children}</h2>
);

const CustomH3: Components['h3'] = ({node, children, ...props}) => (
    <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3" {...props}>{children}</h3>
);

const CustomP: Components['p'] = ({node, children, ...props}) => (
    <p className="text-gray-600 leading-relaxed mb-4" {...props}>{children}</p>
);

const CustomCode: Components['code'] = ({node, children, ...props}) => (
    <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded font-mono text-sm" {...props}>
        {children}
    </code>
);

const CustomUl: Components['ul'] = ({node, children, ...props}) => (
    <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600" {...props}>
        {children}
    </ul>
);

const CustomLi: Components['li'] = ({node, children, ...props}) => (
    <li className="leading-relaxed" {...props}>
        {children}
    </li>
);

export default function EntryCard({entry}: EntryCardProps) {
    const components: Components = {
        h1: CustomH1,
        h2: CustomH2,
        h3: CustomH3,
        p: CustomP,
        code: CustomCode,
        ul: CustomUl,
        li: CustomLi,
    };

    return (
        <div className="grid py-20 md:grid-cols-4 md:px-5 xl:px-0">
            <div className="sticky top-20 hidden self-start md:col-span-1 md:block">
                <time dateTime={entry.createdAt.toISOString()}
                      className="text-neutral-500 transition-colors hover:text-neutral-800">
                    {new Date(entry.createdAt).toLocaleDateString()}
                </time>
            </div>
            <div className="flex flex-col gap-6 md:col-span-3">
                <Image alt="" width={2400} height={1260}
                       className="blur-0 aspect-video border border-neutral-200 object-cover md:rounded-2xl"
                       src="https://placehold.co/2400x1260"/>
                <time dateTime={entry.createdAt.toISOString()}
                      className="text-sm text-neutral-500 transition-all group-hover:text-neutral-800 md:hidden">
                    {new Date(entry.createdAt).toLocaleDateString()}
                </time>
                <h2 className="font-display text-2xl font-medium tracking-tight text-neutral-800 hover:underline hover:decoration-1 hover:underline-offset-4 md:text-3xl">
                    {entry.title}
                </h2>
                <article className="prose prose-gray max-w-none transition-all prose-headings:relative prose-headings:scroll-mt-20 prose-headings:font-display prose-a:font-medium prose-a:text-gray-500 prose-a:underline-offset-4 hover:prose-a:text-black prose-thead:text-lg mx-5 md:mx-0">
                    <ReactMarkdown components={components}>
                        {entry.content}
                    </ReactMarkdown>
                </article>
            </div>
        </div>
    )
}
