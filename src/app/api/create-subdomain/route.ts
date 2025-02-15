import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {auth, currentUser} from "@clerk/nextjs/server";

export async function POST(req: Request) {
    try {
        const { userId: clerkId } = await auth();
        const { subdomain } = await req.json();

        if (!clerkId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const clerkUser = await currentUser()

        // Create or get user
        const user = await prisma.user.upsert({
            where: { clerkId },
            create: {
                clerkId,
                email: clerkUser?.emailAddresses[0]?.emailAddress ?? "",
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
        return new NextResponse('Error creating subdomain: ' + error, { status: 500 });
    }
}
