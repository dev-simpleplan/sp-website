// app/api/home-page/route.js

export async function GET() {
  try {
    const res = await fetch(
      "http://72.61.235.119:1337/api/home-page?populate[hero][populate]=*&populate[video_section][populate]=*&populate[struggle][populate]=*&populate[our_approach][populate]=*&populate[case_study][populate][case_study_cards][populate]=*&populate[offer_section][populate]=*&populate[stats][populate]=*&populate[service][populate]=*&populate[ready_to_build][populate]=*&populate[testimonials][populate][Testimonials][populate]=*&populate[trusted_section][populate]=*&populate[awards_section][populate][projects][populate]=*&populate[about_section][populate]=*&populate[tools_section][populate][tools][populate]=*&populate[blog_section][populate][blog_posts][populate]=*&populate[pre_footer][populate]=*",
      {
        headers: {
          // Authorization: `Bearer ${process.env.STRAPI_TOKEN}`
        },
        cache: "no-store",
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
    console.error("home-page route error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
