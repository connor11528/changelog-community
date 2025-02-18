import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {getCurrentUser} from "@/lib/auth";

export async function GET(
    request: Request,
    { params }: { params: { projectId: string } }
) {
    try {
        const user = await getCurrentUser()

        const { searchParams } = new URL(request.url);
        const fromParam = searchParams.get('from');
        const toParam = searchParams.get('to');

        if (!fromParam || !toParam) {
            return new NextResponse("Missing date range", { status: 400 });
        }

        // Get project and verify membership
        const project = await prisma.project.findFirst({
            where: {
                id: params.projectId,
                members: {
                    some: {
                        userId: user.id
                    }
                }
            }
        });

        console.log(project)

        if (!project || !project.githubRepoOwner || !project.githubRepoName) {
            return new NextResponse("Project not found or GitHub not configured", { status: 404 });
        }

        const from = new Date(fromParam).toISOString();
        const to = new Date(toParam).toISOString();

        // Fetch commits from GitHub API without token
        const response = await fetch(
            `https://api.github.com/repos/${project.githubRepoOwner}/${project.githubRepoName}/commits?since=${from}&until=${to}`,
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    // Add token only if available for higher rate limits
                    ...(project.githubToken && {
                        'Authorization': `Bearer ${project.githubToken}`
                    })
                }
            }
        );

        if (!response.ok) {
            // Check if it's a private repository error
            if (response.status === 404) {
                return new NextResponse(
                    "Repository not found. If this is a private repository, you'll need to connect your GitHub account.",
                    { status: 404 }
                );
            }
            return new NextResponse("Failed to fetch commits", { status: response.status });
        }

        const commits = await response.json();

        // Transform commits to our format
        const transformedCommits = commits.map((commit: any) => ({
            sha: commit.sha,
            message: commit.commit.message,
            author: commit.commit.author?.name || 'Unknown',
            date: commit.commit.author?.date,
            type: commit.commit.message.match(/^(\w+)(\(.+\))?:/)?.[1]
        }));

        console.log({transformedCommits})
        return NextResponse.json(transformedCommits);

    } catch (error) {
        console.error('[GITHUB_COMMITS]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}