import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const addons = await prisma.addon.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });
  return NextResponse.json(addons);
}
