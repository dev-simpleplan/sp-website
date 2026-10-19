// app/api/blog-posts/excerpts/route.js
// Returns { data: { [slug]: excerpt } } for the comma-separated `slugs` query
// param. The /blogs page calls this only for the cards currently on screen,
// since populating blog_inner_page_contents for every post is slow on Strapi.

import { getFirstParagraph } from "../../../blogs/getFirstParagraph";

const STRAPI_BASE_URL = "http://72.61.235.119:1337";
const MAX_SLUGS = 50;

export async function GET(request) {
  const slugs = (new URL(request.url).searchParams.get("slugs") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, MAX_SLUGS);

  if (!slugs.length) return Response.json({ data: {} });

  const filters = slugs
    .map((slug, i) => `filters[slug][$in][${i}]=${encodeURIComponent(slug)}`)
    .join("&");
  const url =
    `${STRAPI_BASE_URL}/api/blog-posts?${filters}` +
    `&pagination[pageSize]=${MAX_SLUGS}&fields[0]=slug` +
    `&populate[blog_inner_page_contents][populate]=*`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.STRAPI_TOKEN}` },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return Response.json(
        { error: "Failed to fetch excerpts from external API" },
        { status: res.status }
      );
    }

    const payload = await res.json();
    const data = {};
    for (const post of payload?.data || []) {
      if (post?.slug) data[post.slug] = getFirstParagraph(post);
    }
    return Response.json({ data });
  } catch (error) {
    console.error("blog-posts/excerpts route error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
