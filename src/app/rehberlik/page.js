import "./Rehberlik.css";
import { getDbData } from "@/lib/db";
import RehberlikClient from "./RehberlikClient";

export const dynamic = 'force-dynamic';

export default async function RehberlikPage() {
  const db = await getDbData();
  const settings = db?.settings || {};

  return <RehberlikClient settings={settings} />;
}
