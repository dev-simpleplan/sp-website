export const getImageUrl = (image) => {
  try {
    if (!image || typeof image.url !== "string" || image.url.trim() === "") {
      return "/fallback-image.jpg"; // Use a valid public fallback image
    }

    // Ensure the URL is properly formatted
    const baseUrl = "http://72.61.235.119:1337"; // Change this to HTTPS if needed
    let imageUrl = image.url.startsWith("/") ? `${baseUrl}${image.url}` : image.url;

    return new URL(imageUrl).href; // Ensure the URL is valid
  } catch (error) {
    console.error("Error generating image URL:", error);
    return "/fallback-image.jpg"; // Return fallback image on error
  }
};