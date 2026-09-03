import { put } from '@vercel/blob';
import { z } from 'zod';
import { slugify } from './catalog';

/**
 * Shared parsing for the admin product endpoints. The admin form posts
 * multipart/form-data (so it can carry image files); scripts and quick edits
 * post plain JSON. Both land on the same validated shape.
 */

export const productSchema = z.object({
  slug: z.string().min(1).optional(),
  namePt: z.string().min(1),
  nameEn: z.string().min(1),
  descriptionPt: z.string().optional(),
  descriptionEn: z.string().optional(),
  brand: z.string().optional(),
  sku: z.string().optional(),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().nullable().optional(),
  stock: z.number().int().min(0),
  category: z.enum([
    'WASH',
    'INTERIOR',
    'POLISH',
    'PROTECTION',
    'WHEELS',
    'ACCESSORIES',
    'KITS',
  ]),
  images: z.array(z.string().url()).default([]),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export const productPatchSchema = productSchema.partial();

/** Uploads any `images` files on the form to Vercel Blob and returns their URLs. */
async function uploadImages(formData: FormData): Promise<string[]> {
  const files = formData
    .getAll('images')
    .filter((v): v is File => v instanceof File && v.size > 0);

  if (files.length === 0) return [];

  const uploaded = await Promise.all(
    files.map((file) =>
      put(`shop/${Date.now()}-${file.name}`, file, { access: 'public' }),
    ),
  );
  return uploaded.map((blob) => blob.url);
}

function num(value: FormDataEntryValue | null): number | undefined {
  if (value === null || value === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function str(value: FormDataEntryValue | null): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

/**
 * Reads the request body as either multipart form data or JSON and returns the
 * raw object to validate. `existingImages` (a JSON array of URLs the admin kept)
 * is merged ahead of any newly uploaded files.
 */
export async function readProductBody(req: Request): Promise<Record<string, unknown>> {
  const contentType = req.headers.get('content-type') ?? '';

  if (!contentType.includes('multipart/form-data')) {
    return (await req.json()) as Record<string, unknown>;
  }

  const formData = await req.formData();
  const uploaded = await uploadImages(formData);

  let keptImages: string[] = [];
  const keptRaw = str(formData.get('existingImages'));
  if (keptRaw) {
    try {
      const parsed = JSON.parse(keptRaw);
      if (Array.isArray(parsed)) keptImages = parsed.filter((v) => typeof v === 'string');
    } catch {
      // Malformed list — treat as "no images kept" rather than failing the save.
    }
  }

  const namePt = str(formData.get('namePt'));
  const body: Record<string, unknown> = {
    slug: str(formData.get('slug')) ?? (namePt ? slugify(namePt) : undefined),
    namePt,
    nameEn: str(formData.get('nameEn')),
    descriptionPt: str(formData.get('descriptionPt')),
    descriptionEn: str(formData.get('descriptionEn')),
    brand: str(formData.get('brand')),
    sku: str(formData.get('sku')),
    price: num(formData.get('price')),
    compareAtPrice: num(formData.get('compareAtPrice')) ?? null,
    stock: num(formData.get('stock')),
    category: str(formData.get('category')),
    images: [...keptImages, ...uploaded],
    sortOrder: num(formData.get('sortOrder')) ?? 0,
  };

  if (formData.has('isActive')) body.isActive = str(formData.get('isActive')) === 'true';
  if (formData.has('isFeatured')) body.isFeatured = str(formData.get('isFeatured')) === 'true';

  // Drop keys the form left blank so PATCH doesn't null out untouched fields.
  return Object.fromEntries(Object.entries(body).filter(([, v]) => v !== undefined));
}
