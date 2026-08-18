import DetailView from "@/components/ui/DetailView";
import { getDbData } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  const db = await getDbData();
  const rawData = db?.kurslar || db?.Courses || db?.courses || [];
  const course = rawData.find((c) => c.id.toString() === id?.toString());

  if (!course) {
    return { title: "Kurs Tapılmadı | King Education Company" };
  }

  return {
    title: `${course.title} | King Education Company`,
    description: course.description?.substring(0, 160) || "King Education Company kursları.",
    openGraph: {
      title: course.title,
      description: course.description?.substring(0, 160),
      images: course.image ? [{ url: course.image }] : [],
    }
  };
}

export default async function KurslarDetailPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  const db = await getDbData();
  const rawData = db?.kurslar || db?.Courses || db?.courses || [];
  
  const course = rawData.find((c) => c.id.toString() === id.toString());

  return <DetailView data={course} defaultCategoryPath="kurslar" defaultType="course" />;
}
