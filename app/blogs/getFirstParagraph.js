// Pulls the short card preview for a blog post out of its inner content
// (blog_inner_page_contents dynamic zone): the first non-empty paragraph
// of the first blog.content-part block, falling back to a
// blog.small-content short_description.
const nodesToText = (children) =>
  (children || [])
    .map((child) => (child?.type === "link" ? nodesToText(child.children) : child?.text || ""))
    .join("")
    .replace(/\s+/g, " ")
    .trim();

export function getFirstParagraph(post) {
  const blocks = post?.blog_inner_page_contents;
  if (!Array.isArray(blocks)) return "";

  for (const block of blocks) {
    if (block?.__component === "blog.content-part" && Array.isArray(block.content)) {
      for (const node of block.content) {
        if (node?.type && node.type !== "paragraph") continue;
        const text = nodesToText(node?.children);
        if (text) return text;
      }
    } else if (block?.__component === "blog.small-content") {
      const text = (block.short_description || "").replace(/\s+/g, " ").trim();
      if (text) return text;
    }
  }
  return "";
}

// Server-side slimming for the blog listing routes: the card only needs
// the excerpt + a few image fields, not every content block (images, FAQs,
// tables) of every post — those made the list payload and load time much
// bigger. Replaces blog_inner_page_contents with a plain `excerpt` string.
const slimImage = (image) =>
  image && {
    url: image.url,
    alternativeText: image.alternativeText,
    width: image.width,
    height: image.height,
  };

export function slimPost(post) {
  if (!post) return post;
  const { blog_inner_page_contents, ...rest } = post;
  return {
    ...rest,
    excerpt: getFirstParagraph(post),
    featured_image: slimImage(post.featured_image),
  };
}
