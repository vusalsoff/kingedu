import DetailView from "@/components/ui/DetailView";
import { getDbData } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  const db = await getDbData();
  const rawData = db?.kitablar || db?.Books || db?.books || [];
  const book = rawData.find((c) => c.id.toString() === id?.toString());

  if (!book) {
    return { title: "Kitab Tapılmadı | King Education Company" };
  }

  return {
    title: `${book.title} | King Education Company`,
    description: book.description?.substring(0, 160) || "King Education Company kitabları.",
    openGraph: {
      title: book.title,
      description: book.description?.substring(0, 160),
      images: book.image ? [{ url: book.image }] : [],
    }
  };
}

export default async function KitablarDetailPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  const db = await getDbData();
  const rawData = db?.kitablar || db?.Books || db?.books || [];
  
  const book = rawData.find((c) => c.id.toString() === id.toString());

  return <DetailView data={book} defaultCategoryPath="kitablar" defaultType="book" settings={db?.settings || {}} />;
}
