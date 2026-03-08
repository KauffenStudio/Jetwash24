import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';

// GET /api/gallery — Public
export async function GET() {
  const images = await prisma.galleryImage.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });
  return NextResponse.json(images);
}

// POST /api/gallery — Admin only, handles image upload
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const beforeFile = formData.get('beforeImage') as File | null;
  const afterFile = formData.get('afterImage') as File | null;
  const descriptionPt = formData.get('descriptionPt') as string | null;
  const descriptionEn = formData.get('descriptionEn') as string | null;
  const servicePerformed = formData.get('servicePerformed') as string | null;

  if (!beforeFile || !afterFile) {
    return NextResponse.json({ error: 'Both before and after images are required' }, { status: 400 });
  }

  // Upload both images to Vercel Blob
  const [beforeBlob, afterBlob] = await Promise.all([
    put(`gallery/before-${Date.now()}-${beforeFile.name}`, beforeFile, { access: 'public' }),
    put(`gallery/after-${Date.now()}-${afterFile.name}`, afterFile, { access: 'public' }),
  ]);

  const image = await prisma.galleryImage.create({
    data: {
      beforeImageUrl: beforeBlob.url,
      afterImageUrl: afterBlob.url,
      description: descriptionPt ?? null,
      descriptionPt: descriptionPt ?? null,
      descriptionEn: descriptionEn ?? null,
      servicePerformed: servicePerformed ?? null,
    },
  });

  return NextResponse.json(image, { status: 201 });
}
