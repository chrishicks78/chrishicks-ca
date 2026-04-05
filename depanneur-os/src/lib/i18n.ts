import { locales as localeValues, weekdays as weekdayValues } from "./types";
import type { Locale } from "./types";

export type TranslatedText = Record<Locale, string>;

export const locales = localeValues;
export const weekdays = weekdayValues;

export const localeMeta: Record<
  Locale,
  { label: string; nativeLabel: string; htmlLang: string }
> = {
  en: { label: "English", nativeLabel: "English", htmlLang: "en" },
  fr: { label: "French", nativeLabel: "Français", htmlLang: "fr" },
  "zh-Hans": {
    label: "Simplified Chinese",
    nativeLabel: "简体中文",
    htmlLang: "zh-Hans",
  },
  "zh-Hant": {
    label: "Traditional Chinese",
    nativeLabel: "繁體中文",
    htmlLang: "zh-Hant",
  },
};

export function t(locale: Locale, copy: TranslatedText) {
  return copy[locale] ?? copy.en;
}
