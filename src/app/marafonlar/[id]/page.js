import DetailView from "@/components/ui/DetailView";
import { getDbData } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  const db = await getDbData();
  const rawData = db?.marafonlar || db?.Marathons || db?.marathons || [];
  const marathon = rawData.find((c) => c.id.toString() === id?.toString());

  if (!marathon) {
    return { title: "Marafon Tapılmadı | King Education Company" };
  }

  return {
    title: `${marathon.title} | King Education Company`,
    description: marathon.description?.substring(0, 160) || "King Education Company marafonları.",
    openGraph: {
      title: marathon.title,
      description: marathon.description?.substring(0, 160),
      images: marathon.image ? [{ url: marathon.image }] : [],
    }
  };
}

export default async function MarafonlarDetailPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  const db = await getDbData();
  const rawData = db?.marafonlar || db?.Marathons || db?.marathons || [];
  
  const marathon = rawData.find((c) => c.id.toString() === id.toString());

  return <DetailView data={marathon} defaultCategoryPath="marafonlar" defaultType="marathon" />;
}
