import { notFound } from "next/navigation";
import { DepanneurDashboard } from "@/components/depanneur-dashboard";
import { locales, t, uiText } from "@/lib/content";
import type { Locale } from "@/lib/types";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return <DepanneurDashboard locale={locale as Locale} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = locales.includes(locale as Locale) ? (locale as Locale) : "en";

  return {
    title: {
      absolute: t(safeLocale, uiText.appTitle),
    },
    description: t(safeLocale, uiText.appSummary),
  };
}
