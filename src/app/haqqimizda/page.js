import { getDbData } from "@/lib/db";
import HaqqimizdaClient from "./HaqqimizdaClient";

export const metadata = {
  title: "Haqqımızda",
  description: "King Education Company haqqında ətraflı məlumat və tarixçə",
};

export const dynamic = 'force-dynamic';

export default async function Haqqimizda() {
  const db = await getDbData();
  const settings = db?.settings || {};
  
  return <HaqqimizdaClient settings={settings} />;
}
