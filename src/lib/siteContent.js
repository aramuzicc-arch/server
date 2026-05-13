import { SiteContent } from "../models/SiteContent.js";
import { defaultSiteContent } from "../data/siteContentDefaults.js";

function pickParagraphs(doc) {
  if (doc?.aboutBioParagraphs?.length) return doc.aboutBioParagraphs;
  return defaultSiteContent.aboutBioParagraphs;
}

function pickTimeline(doc) {
  if (doc?.timeline?.length) return [...doc.timeline].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return defaultSiteContent.timeline;
}

function pickStats(doc) {
  if (doc?.stats?.length) return [...doc.stats].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return defaultSiteContent.stats;
}

export async function getPublicSiteContent() {
  const doc = await SiteContent.findOne({ slug: "main" }).lean();
  return {
    slug: "main",
    aboutHeroTagline: doc?.aboutHeroTagline || defaultSiteContent.aboutHeroTagline,
    aboutHeroImage: doc?.aboutHeroImage || defaultSiteContent.aboutHeroImage,
    aboutPortraitImage: doc?.aboutPortraitImage || defaultSiteContent.aboutPortraitImage,
    aboutBioParagraphs: pickParagraphs(doc),
    timeline: pickTimeline(doc),
    stats: pickStats(doc),
    publicPhone: (doc?.publicPhone ?? defaultSiteContent.publicPhone ?? "").trim(),
  };
}

/** Merge PATCH-style body so Settings can update `publicPhone` without wiping About fields. */
export function mergeSiteContentForUpsert(prev, body) {
  const p = prev || {};
  return {
    slug: "main",
    aboutHeroTagline:
      body.aboutHeroTagline !== undefined
        ? body.aboutHeroTagline
        : (p.aboutHeroTagline ?? defaultSiteContent.aboutHeroTagline),
    aboutHeroImage:
      body.aboutHeroImage !== undefined ? body.aboutHeroImage : (p.aboutHeroImage ?? defaultSiteContent.aboutHeroImage),
    aboutPortraitImage:
      body.aboutPortraitImage !== undefined
        ? body.aboutPortraitImage
        : (p.aboutPortraitImage ?? defaultSiteContent.aboutPortraitImage),
    aboutHeroImagePublicId:
      body.aboutHeroImagePublicId !== undefined
        ? body.aboutHeroImagePublicId ?? ""
        : (p.aboutHeroImagePublicId ?? ""),
    aboutPortraitImagePublicId:
      body.aboutPortraitImagePublicId !== undefined
        ? body.aboutPortraitImagePublicId ?? ""
        : (p.aboutPortraitImagePublicId ?? ""),
    aboutBioParagraphs:
      body.aboutBioParagraphs !== undefined ? body.aboutBioParagraphs : pickParagraphs(p),
    timeline: body.timeline !== undefined ? body.timeline : pickTimeline(p),
    stats: body.stats !== undefined ? body.stats : pickStats(p),
    publicPhone: body.publicPhone !== undefined ? String(body.publicPhone ?? "").trim() : (p.publicPhone ?? "").trim(),
  };
}
