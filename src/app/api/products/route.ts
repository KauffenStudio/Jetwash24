import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { ProductCategory } from '@prisma/client';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { productSchema, readProductBody } from '@/lib/shop/product-form';
import { PRODUCT_CATEGORIES, slugify } from '@/lib/shop/catalog';

// GET /api/products — Public catalogue.
// ?category=WASH  ?featured=1  ?limit=8  ?all=1 (admin only: includes inactive)
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const limit = searchParams.get('limit');
  const wantsAll = searchParams.get('all') === '1';

  let includeInactive = false;
  if (wantsAll) {
    const session = await getServerSession(authOptions);
    includeInactive = (session?.user as { role?: string } | undefined)?.role === 'ADMIN';
  }

  // Ignore an unknown ?category= rather than 500-ing on a bad enum value.
  const validCategory = PRODUCT_CATEGORIES.find((c) => c.value === category)?.value as
    | ProductCategory
    | undefined;

  const products = await prisma.product.findMany({
    where: {
      ...(includeInactive ? {} : { isActive: true }),
      ...(validCategory ? { category: validCategory } : {}),
      ...(featured === '1' ? { isFeatured: true } : {}),
    },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    take: limit ? Number(limit) : undefined,
  });

  return NextResponse.json(products);
}

// POST /api/products — Admin only. Accepts multipart (with image files) or JSON.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await readProductBody(req);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const data = parsed.data;
  const baseSlug = data.slug ? slugify(data.slug) : slugify(data.namePt);

  // Slugs are the product URL, so they must be unique — append -2, -3 … if taken.
  let slug = baseSlug;
  let attempt = 2;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${attempt}`;
    attempt += 1;
  }

  const product = await prisma.product.create({
    data: { ...data, slug, compareAtPrice: data.compareAtPrice ?? null },
  });

  return NextResponse.json(product, { status: 201 });
}
