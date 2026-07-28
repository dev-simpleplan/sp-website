// app/api/image-proxy/route.js
// Streams CMS images from the http-only Strapi backend through this
// same-origin https route, so the browser never fetches mixed content.

const STRAPI_BASE = "http://72.61.235.119:1337";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (!path || !path.startsWith("/")) {
    return new Response("Invalid path", { status: 400 });
  }

  try {
    const upstream = await fetch(`${STRAPI_BASE}${path}`, { cache: "no-store" });

    if (!upstream.ok || !upstream.body) {
      return new Response("Image not found", { status: 404 });
    }

    return new Response(upstream.body, {
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("image-proxy error:", error);
    return new Response("Failed to fetch image", { status: 502 });
  }
}
