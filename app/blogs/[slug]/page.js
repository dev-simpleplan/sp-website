"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { getImageUrl } from "../../components/getImageUrl";
import "../blogStyle.css";

// Field names confirmed against the live /api/blog-posts response — see
// the listing page (../page.js) for the full accessor notes.
const getPostTitle = (post) => post?.title || "Untitled";

const getPostImage = (post) => post?.featured_image;

// body_content is a plain string (paragraphs separated by a blank line),
// not a Strapi "blocks" rich-text array — renderContent() below handles
// both shapes, in case that ever changes.
const getPostContent = (post) => post?.body_content ?? post?.content ?? post?.body ?? "";

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    axios
      .get(`/api/blog-posts/${encodeURIComponent(slug)}`)
      .then((res) => setPost(res.data?.data || null))
      .catch((err) => {
        console.error("Error fetching blog post:", err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="loading">
        <div className="loadingIn">
          <div className="loadingText">
            <span data-text="L">L</span>
            <span data-text="O">O</span>
            <span data-text="A">A</span>
            <span data-text="D">D</span>
            <span data-text="I">I</span>
            <span data-text="N">N</span>
            <span data-text="G">G</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-post-not-found">
        <p>Blog post not found.</p>
      </div>
    );
  }

  const title = getPostTitle(post);
  const image = getPostImage(post);
  const content = getPostContent(post);

  return (
    <article className="blog-post">
      <div className="blog-container blog-post-header">
        <h1 className="blog-post-title">{title}</h1>
      </div>

      {image && (
        <div className="blog-post-cover-wrap">
          <img src={getImageUrl(image)} alt={title} className="blog-post-cover" />
        </div>
      )}

      <div className="blog-container blog-post-body">{renderContent(content)}</div>
    </article>
  );
}

// Handles both content shapes: a plain string (the current body_content
// field — split into paragraphs on blank lines) or a Strapi "blocks"
// rich-text array (heading/list/quote/image nodes with inline marks),
// in case the field ever switches to that format.
function renderContent(content) {
  if (typeof content === "string") {
    const paragraphs = content.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    return paragraphs.map((paragraph, i) => {
      // Some body_content values use markdown-style "## Heading" lines
      // (others are plain text) — render those as real headings instead
      // of literal "##" text.
      const headingMatch = paragraph.match(/^(#{2,4})\s+(.*)/);
      if (headingMatch) {
        const Tag = `h${headingMatch[1].length + 1}`; // ## -> h3, ### -> h4, #### -> h5
        return (
          <Tag key={i} className="blog-post-heading">
            {headingMatch[2]}
          </Tag>
        );
      }
      return (
        <p key={i} className="blog-post-paragraph">
          {paragraph}
        </p>
      );
    });
  }

  return renderBlocks(content);
}

// Minimal renderer for Strapi's "blocks" rich-text format — handles the
// common node types (paragraph, heading, list, quote) and inline marks
// (bold/italic/underline/code). Unknown block types fall back to a plain
// paragraph of their text so nothing silently disappears; adjust here
// once the real content shape is confirmed.
function renderBlocks(blocks) {
  if (!Array.isArray(blocks) || !blocks.length) return null;

  return blocks.map((block, i) => {
    switch (block?.type) {
      case "heading": {
        const level = Math.min(Math.max(block.level || 2, 2), 4);
        const Tag = `h${level}`;
        return (
          <Tag key={i} className="blog-post-heading">
            {renderInline(block.children)}
          </Tag>
        );
      }
      case "list": {
        const ListTag = block.format === "ordered" ? "ol" : "ul";
        return (
          <ListTag key={i} className="blog-post-list">
            {(block.children || []).map((item, j) => (
              <li key={j}>{renderInline(item.children)}</li>
            ))}
          </ListTag>
        );
      }
      case "quote":
        return (
          <blockquote key={i} className="blog-post-quote">
            {renderInline(block.children)}
          </blockquote>
        );
      case "image":
        return block.image ? (
          <img
            key={i}
            src={getImageUrl(block.image)}
            alt={block.image?.alternativeText || ""}
            className="blog-post-inline-image"
          />
        ) : null;
      case "paragraph":
      default:
        return (
          <p key={i} className="blog-post-paragraph">
            {renderInline(block?.children)}
          </p>
        );
    }
  });
}

function renderInline(children) {
  if (!Array.isArray(children)) return null;

  return children.map((child, i) => {
    let node = child?.text ?? "";
    if (child?.code) node = <code key={`code-${i}`}>{node}</code>;
    if (child?.bold) node = <strong key={`b-${i}`}>{node}</strong>;
    if (child?.italic) node = <em key={`i-${i}`}>{node}</em>;
    if (child?.underline) node = <u key={`u-${i}`}>{node}</u>;
    return <span key={i}>{node}</span>;
  });
}
