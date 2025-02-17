import {prisma} from "@/lib/prisma";
import {DashboardClient} from "@/components/DashboardClient";

export default async function Page() {
    const projects = await prisma.project.findMany({
        select: {
            id: true,
            subdomain: true,
            githubRepoOwner: true,
            githubRepoName: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return <DashboardClient projects={projects} />;
}