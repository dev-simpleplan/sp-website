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
