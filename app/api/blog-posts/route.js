// app/api/blog-posts/route.js
// Proxies the full "All Blogs" listing used by the /blogs page's grid +
// category filter — same pattern as the other page routes. Deliberately
// light (no inner content): populating blog_inner_page_contents for all
// ~100 posts took ~20s on Strapi. Excerpts are fetched separately, only
// for the posts on screen — see ./excerpts/route.js.

export async function GET() {
  try {
    const res = await fetch(
      "http://72.61.235.119:1337/api/blog-posts?pagination[pageSize]=100&fields[0]=title&fields[1]=slug&populate[featured_image][fields][0]=url&populate[categories][fields][0]=Name",
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      return Response.json(
        { error: "Failed to fetch from external API" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error("blog-posts route error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
