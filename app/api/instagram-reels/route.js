// app/api/instagram-reels/route.js
// Fetches the latest reels of an Instagram account through the official
// Instagram Graph API and returns just what the ticker needs.
//
// Required env var (server-side only):
//   INSTAGRAM_ACCESS_TOKEN — long-lived token of an Instagram Business /
//   Creator account (Instagram API with Instagram Login).
// Optional:
//   INSTAGRAM_REELS_LIMIT — how many reels to return (default 12).

export const revalidate = 3600;

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token) {
    return Response.json({ reels: [], error: "not_configured" });
  }

  const limit = Number(process.env.INSTAGRAM_REELS_LIMIT) || 12;

  try {
    const url = new URL("https://graph.instagram.com/me/media");
    url.searchParams.set(
      "fields",
      "id,media_type,media_product_type,media_url,thumbnail_url,permalink,caption"
    );
    // Over-fetch: the account feed also holds photos/carousels we filter out.
    url.searchParams.set("limit", String(limit * 3));
    url.searchParams.set("access_token", token);

    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      return Response.json(
        { reels: [], error: "instagram_api_error" },
        { status: 200 }
      );
    }

    const json = await res.json();

    const reels = (json.data || [])
      .filter(
        (m) =>
          m.media_product_type === "REELS" ||
          (m.media_type === "VIDEO" && !m.media_product_type)
      )
      .filter((m) => m.thumbnail_url)
      .slice(0, limit)
      .map((m) => ({
        id: m.id,
        thumbnail: m.thumbnail_url,
        video: m.media_url || "",
        permalink: m.permalink,
        caption: m.caption || "",
      }));

    return Response.json({ reels });
  } catch (error) {
    console.error("instagram-reels route error:", error);
    return Response.json({ reels: [], error: "internal_error" });
  }
}
