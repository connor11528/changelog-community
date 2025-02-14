import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    const { subdomain } = await req.json();

    const existing = await prisma.project.findUnique({
        where: { subdomain }
    });

    if (existing) {
        return new NextResponse('Subdomain taken', { status: 400 });
    }

    return NextResponse.json({ available: true });
}