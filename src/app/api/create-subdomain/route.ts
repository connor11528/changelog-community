import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    try {
        const { userId: clerkId } = await auth();
        const { subdomain } = await req.json();

        if (!clerkId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // @ts-ignore
        const clerkUser = await clerkClient.users.getUser(clerkId);
        const email = clerkUser.emailAddresses[0].emailAddress;

        // Create or get user
        const user = await prisma.user.upsert({
            where: { clerkId },
            create: {
                clerkId,
                email
            },
            update: {}
        });

        // Create project and add user as admin
        const project = await prisma.project.create({
            data: {
                subdomain,
                members: {
                    create: {
                        userId: user.id,
                        role: 'admin'
                    }
                }
            }
        });

        return NextResponse.json(project);
    } catch (error) {
        console.error('Error:', error);
        return new NextResponse('Error creating subdomain', { status: 500 });
    }
}
