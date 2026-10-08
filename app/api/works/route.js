// app/api/works/route.js

export async function GET() {
  try {
    const res = await fetch(
      "http://72.61.235.119:1337/api/works?pagination[pageSize]=100&populate=*",
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      return Response.json(
        { error: "Failed to fetch from external API" },
        { status: res.status }
      );
    }

    return Response.json(await res.json());
  } catch (error) {
    console.error("works route error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
