// ===== Structured Data Component =====
// Renders JSON-LD structured data in head
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

interface StructuredDataProps {
  data: string;
}

export default function StructuredData({ data }: StructuredDataProps) {
  try {
    JSON.parse(data);
  } catch {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: data }}
    />
  );
}
