import { Eye, Github } from 'lucide-react';
import {prisma} from "@/lib/prisma";
import Link from "next/link";
import {getProjectUrl} from "@/lib/utils";

interface Project {
    id: string;
    name: string;
    githubUrl: string;
}

export async function getProjects() {
    return await prisma.project.findMany({
        select: {
            id: true,
            subdomain: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}

export default async function Page() {
    const projects = await getProjects()
    console.log(projects)
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Your Projects</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="rounded-lg border border-gray-200 bg-white shadow-sm"
                    >
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="font-mono text-lg">
                                {project.subdomain}.changelog.community
                            </h3>
                        </div>
                        <div className="p-4 flex space-x-2">
                            <Link href={getProjectUrl(project.subdomain)} className="cursor-pointer inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                <Eye className="mr-2 h-4 w-4" />
                                View Changelog
                            </Link>
                            <Link
                                href={""}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cursor-pointer inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                <Github className="mr-2 h-4 w-4" />
                                Link GitHub
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}