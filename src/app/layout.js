import { Montserrat } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import ClientLayout from "@/components/layout/ClientLayout";
import { getDbData } from "@/lib/db";
import "./globals.css";

export const revalidate = 0;

const font = Montserrat({ subsets: ["latin", "latin-ext"] });

export async function generateMetadata() {
  const db = await getDbData();
  const settings = db?.settings || {};

  const title = settings.seo_title || "King Education Company";
  const description = settings.seo_description || "King Education Company - Rəsmi Veb Sayt - Kurslar, Təlimlər, Marafonlar və daha çoxu.";
  const keywords = settings.seo_keywords || "King Education Company, Kurslar, Təlimlər, Marafonlar, Kitablar, Mirfəqan Hacıyev";
  const verification = settings.google_site_verification ? { google: settings.google_site_verification } : {};

  return {
    metadataBase: new URL("https://www.kingedu.az"),
    title: {
      template: "%s | King Education Company",
      default: title,
    },
    description: description,
    keywords: keywords,
    verification: verification,
    icons: {
      icon: "/img/Icon.jpeg",
      apple: "/img/Icon.jpeg",
    },
    openGraph: {
      title: title,
      description: description,
      url: "https://www.kingedu.az",
      siteName: title,
      images: [
        {
          url: "https://www.kingedu.az/img/Icon.jpeg",
          width: 1080,
          height: 1080,
          alt: "King Education Company Logo",
        },
      ],
      locale: "az_AZ",
      type: "website",
    }
  };
}

export default async function RootLayout({ children }) {
  const db = await getDbData();
  const settings = db?.settings || {};

  return (
    <html lang="az" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={font.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ClientLayout settings={settings}>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
