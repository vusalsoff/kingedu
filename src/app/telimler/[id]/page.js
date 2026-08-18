import DetailView from "@/components/ui/DetailView";
import { getDbData } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  const db = await getDbData();
  const rawData = db?.telimler || db?.Trainings || db?.trainings || [];
  const training = rawData.find((c) => c.id.toString() === id?.toString());

  if (!training) {
    return { title: "Təlim Tapılmadı | King Education Company" };
  }

  return {
    title: `${training.title} | King Education Company`,
    description: training.description?.substring(0, 160) || "King Education Company təlimləri.",
    openGraph: {
      title: training.title,
      description: training.description?.substring(0, 160),
      images: training.image ? [{ url: training.image }] : [],
    }
  };
}

export default async function TelimlerDetailPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  const db = await getDbData();
  const rawData = db?.telimler || db?.Trainings || db?.trainings || [];
  
  const training = rawData.find((c) => c.id.toString() === id.toString());

  return <DetailView data={training} defaultCategoryPath="telimler" defaultType="training" settings={db?.settings || {}} />;
}
