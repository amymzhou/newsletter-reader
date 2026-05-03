import Parser from "rss-parser";
import sanitizeHtml from "sanitize-html";
import { SOURCES } from "./sources";
import { slugify, stripHtml, truncate } from "./utils";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  link: string;
  pubDate: Date;
  source: string;
  accentColor: string;
};

const parser = new Parser({
  customFields: {
    item: ["content:encoded"],
  },
});

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "figure", "figcaption"]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ["src", "alt", "width", "height"],
    a: ["href", "target", "rel"],
  },
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: { ...attribs, target: "_blank", rel: "noopener noreferrer" },
    }),
  },
};

async function fetchFeed(source: (typeof SOURCES)[number]): Promise<Post[]> {
  try {
    const feed = await parser.parseURL(source.feedUrl);
    return (feed.items || []).map((item) => {
      const rawContent =
        (item as unknown as Record<string, string>)["content:encoded"] ||
        item.content ||
        item.summary ||
        "";
      const content = sanitizeHtml(rawContent, SANITIZE_OPTIONS);
      const plainText = stripHtml(rawContent);
      const title = item.title || "Untitled";
      const link = item.link || source.feedUrl;
      const slug = slugify(title) + "-" + (item.guid || link).slice(-8).replace(/\W/g, "");

      return {
        id: item.guid || link,
        slug,
        title,
        excerpt: truncate(plainText, 200),
        content,
        link,
        pubDate: new Date(item.pubDate || item.isoDate || Date.now()),
        source: source.name,
        accentColor: source.accentColor,
      };
    });
  } catch (err) {
    console.error(`Failed to fetch feed for ${source.name}:`, err);
    return [];
  }
}

export async function fetchAllPosts(): Promise<Post[]> {
  const results = await Promise.all(SOURCES.map(fetchFeed));
  return results
    .flat()
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}
