import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
    request: Request,
    { params }: { params: { projectId: string } }
) {
    try {
        const user = await getCurrentUser();
        const { projectId } = await params;

        const projectMember = await prisma.projectMember.findFirst({
            where: {
                userId: user.id,
                projectId: projectId
            }
        });

        if (!projectMember) {
            return new NextResponse("Project not found", { status: 404 });
        }

        const entries = await prisma.entry.findMany({
            where: {
                projectId: projectId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(entries);

    } catch (error) {
        console.error("[GET_ENTRIES]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}