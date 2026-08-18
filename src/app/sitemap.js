import { getDbData } from "@/lib/db";

export default async function sitemap() {
  const db = await getDbData();
  const baseUrl = "https://www.kingedu.az";

  const staticRoutes = [
    "",
    "/haqqimizda",
    "/kurslar",
    "/telimler",
    "/marafonlar",
    "/pdf-kitablar",
    "/elaqe",
    "/konulluluk",
    "/sosial-media",
    "/mezunlar",
    "/sened-yoxlama"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === "" ? 1 : 0.8,
  }));

  const dynamicKurslar = (db?.kurslar || []).map((kurs) => ({
    url: `${baseUrl}/kurslar/${kurs.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const dynamicTelimler = (db?.telimler || []).map((telim) => ({
    url: `${baseUrl}/telimler/${telim.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const dynamicMarafonlar = (db?.marafonlar || []).map((marafon) => ({
    url: `${baseUrl}/marafonlar/${marafon.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...dynamicKurslar, ...dynamicTelimler, ...dynamicMarafonlar];
}
