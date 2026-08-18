import { getDbData } from "@/lib/db";
import PremiumClient from "./PremiumClient";

export const metadata = {
  title: "Premium Üzvlük | King Education Company",
  description: "King Education Company Premium üzvlük paketləri ilə daha çox üstünlük əldə edin",
};

export const dynamic = 'force-dynamic';

export default async function PremiumPage() {
  const db = await getDbData();
  const settings = db?.settings || {};
  
  return <PremiumClient settings={settings} />;
}
