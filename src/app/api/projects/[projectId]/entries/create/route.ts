import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
    request: Request,
    { params }: { params: { projectId: string } }
) {
    try {
        const user = await getCurrentUser();

        const body = await request.json();
        const { title, content, isDraft, fromCommits, startDate, endDate } = body;

        // Verify user has access to project
        const projectMember = await prisma.projectMember.findFirst({
            where: {
                userId: user.id,
                projectId: params.projectId
            }
        });

        if (!projectMember) {
            return new NextResponse("Project not found", { status: 404 });
        }

        const entry = await prisma.entry.create({
            data: {
                title,
                content,
                isDraft,
                fromCommits,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                projectId: params.projectId
            }
        });

        return NextResponse.json(entry);

    } catch (error) {
        console.error("[CREATE_ENTRY]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}