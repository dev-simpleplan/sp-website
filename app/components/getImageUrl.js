export const getImageUrl = (image, format) => {
  try {
    if (!image || typeof image.url !== "string" || image.url.trim() === "") {
      return "/fallback-image.jpg";
    }

    const url = (format && image.formats?.[format]?.url) || image.url;

    // Cache-buster: changes whenever the file is replaced in Strapi, so the
    // browser/CDN never serves a stale copy of a re-uploaded image.
    const v = encodeURIComponent(image.updatedAt || image.hash || "");
    const proxy = (p) =>
      `/api/image-proxy?path=${encodeURIComponent(p)}${v ? `&v=${v}` : ""}`;

    if (url.startsWith("/")) {
      // Proxy through our own https origin so the browser never has to
      // fetch mixed content from the http-only Strapi backend.
      return proxy(url);
    }

    const parsed = new URL(url);

    if (parsed.protocol === "https:") {
      return parsed.href;
    }

    return proxy(parsed.pathname + parsed.search);
  } catch (error) {
    console.error("Error generating image URL:", error);
    return "/fallback-image.jpg";
  }
};
