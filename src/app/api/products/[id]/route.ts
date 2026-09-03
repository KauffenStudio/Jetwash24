import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { productPatchSchema, readProductBody } from '@/lib/shop/product-form';
import { slugify } from '@/lib/shop/catalog';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return Boolean(session && (session.user as { role?: string }).role === 'ADMIN');
}

// PATCH /api/products/[id] — Admin only. Accepts multipart (with image files) or JSON.
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await readProductBody(req);
  const parsed = productPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { slug, ...rest } = parsed.data;

  const product = await prisma.product.update({
    where: { id: params.id },
    data: { ...rest, ...(slug ? { slug: slugify(slug) } : {}) },
  });

  return NextResponse.json(product);
}

// DELETE /api/products/[id] — Admin only. Soft delete: past orders keep their line items.
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await prisma.product.update({
    where: { id: params.id },
    data: { isActive: false },
  });

  return NextResponse.json({ success: true });
}
