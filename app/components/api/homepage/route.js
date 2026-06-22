// app/api/homepage/route.js

export async function GET() {
    try {
      const res = await fetch("http://72.61.235.119:1337/api/home-page?populate=*", {
        headers: {
          // Add custom headers here if needed
          // Authorization: `Bearer ${process.env.STRAPI_TOKEN}`
        },
        cache: "no-store", // Optional: prevent caching during development
      });
  
      if (!res.ok) {
        return new Response(JSON.stringify({ error: "Failed to fetch from external API" }), {
          status: res.status,
        });
      }
  
      const data = await res.json();
  
      return Response.json(data);
    } catch (error) {
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
      });
    }
  }
  