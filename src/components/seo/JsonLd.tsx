/**
 * Inlines a JSON-LD payload. Schema is always fully derived/static here,
 * so dangerouslySetInnerHTML is safe and avoids React escaping the JSON.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
