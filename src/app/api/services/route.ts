import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export async function GET() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });
  return NextResponse.json(services);
}

const serviceSchema = z.object({
  name: z.string().min(1),
  namePt: z.string().min(1),
  nameEn: z.string().min(1),
  descriptionPt: z.string().optional(),
  descriptionEn: z.string().optional(),
  includesPt: z.array(z.string()),
  includesEn: z.array(z.string()),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  duration: z.number().int().positive(),
  category: z.enum(['INTERIOR', 'EXTERIOR', 'POLISHING', 'FULL']),
  sortOrder: z.number().int().default(0),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const service = await prisma.service.create({
    data: {
      ...parsed.data,
      includes: parsed.data.includesPt, // legacy field
    },
  });

  return NextResponse.json(service, { status: 201 });
}
