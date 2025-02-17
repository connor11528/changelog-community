import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import {auth} from "@clerk/nextjs/server";

export async function POST(req: Request) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return new NextResponse("Unauthorized Clerk User ID", { status: 401 })
        }

        const body = await req.json()
        const { projectId, owner, repoName } = body

        if (!projectId || !owner || !repoName) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const user = await prisma.user.findFirstOrThrow({
            where: { clerkId: userId, }
        });

        // Verify user has access to this project
        const projectMember = await prisma.projectMember.findFirstOrThrow({
            where: {
                userId: user.id,
                projectId,
            },
        });

        // Update project with GitHub info
        const updatedProject = await prisma.project.update({
            where: {
                id: projectId,
            },
            data: {
                githubRepoOwner: owner,
                githubRepoName: repoName,
            },
        })

        return NextResponse.json(updatedProject)
    } catch (error) {
        console.error("[GITHUB_LINK]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}