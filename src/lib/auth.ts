import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export type User = {
    id: string;
    clerkId: string;
    email: string;
}

export async function getCurrentUser(): Promise<User> {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error('Unauthorized');

    const user = await prisma.user.findFirst({
        where: { clerkId }
    });

    if (!user) throw new Error('Unauthorized');

    return user;
}