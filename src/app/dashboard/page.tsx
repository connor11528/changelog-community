import {prisma} from "@/lib/prisma";
import {DashboardClient} from "@/components/DashboardClient";
import {getCurrentUser} from "@/lib/auth";

export default async function Page() {
    const user = await getCurrentUser();
    const initialProjects = await prisma.project.findMany({
        select: {
            id: true,
            subdomain: true,
            githubRepoOwner: true,
            githubRepoName: true,
        },
        where: {
            members: {
                some: {
                    userId: user.id
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return <DashboardClient projects={initialProjects} />;
}