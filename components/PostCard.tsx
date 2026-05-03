"use client";

import Link from "next/link";
import type { Post } from "@/lib/feeds";
import type { Review } from "./ReviewPanel";
import { formatDate } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  isRead: boolean;
  isStarred: boolean;
  review?: Review;
  onToggleRead: () => void;
  onToggleStar: () => void;
}

export function PostCard({ post, isRead, isStarred, review, onToggleRead, onToggleStar }: PostCardProps) {
  const hasReview = review && (review.rating > 0 || review.note.trim());

  return (
    <article
      className="relative rounded-xl p-6 border transition-all hover:shadow-sm"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: isStarred ? post.accentColor : "var(--border)",
        opacity: isRead && !isStarred && !hasReview ? 0.55 : 1,
        cursor: "pointer",
      }}
    >
      {/* Full-card link overlay */}
      <Link
        href={`/post/${post.slug}`}
        className="absolute inset-0 rounded-xl"
        aria-label={`Read: ${post.title}`}
      />

      {/* Header row */}
      <div className="relative z-10 flex items-center gap-2 mb-3">
        <span
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: post.accentColor }}
        >
          {post.source}
        </span>
        <span style={{ color: "var(--border)" }}>·</span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {formatDate(post.pubDate)}
        </span>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={(e) => { e.preventDefault(); onToggleStar(); }}
            aria-label={isStarred ? "Unstar" : "Star"}
            className="text-base transition-opacity hover:opacity-70"
            style={{ color: isStarred ? post.accentColor : "var(--border)" }}
          >
            {isStarred ? "★" : "☆"}
          </button>

          {!isRead && (
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: post.accentColor }}
            />
          )}
        </div>
      </div>

      <h2
        className="font-semibold text-lg leading-snug mb-2"
        style={{ color: "var(--text)" }}
      >
        {post.title}
      </h2>

      <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
        {post.excerpt}
      </p>

      {/* Review preview */}
      {hasReview && (
        <div
          className="mb-4 px-3 py-2 rounded-lg text-xs space-y-1"
          style={{ backgroundColor: "var(--bg)", borderLeft: `3px solid ${post.accentColor}` }}
        >
          {review!.rating > 0 && (
            <div style={{ color: post.accentColor }}>
              {"★".repeat(review!.rating)}{"☆".repeat(5 - review!.rating)}
            </div>
          )}
          {review!.note.trim() && (
            <p className="leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {review!.note.length > 120 ? review!.note.slice(0, 120) + "…" : review!.note}
            </p>
          )}
        </div>
      )}

      {/* Action row */}
      <div className="relative z-10 flex items-center gap-3">
        <a
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-sm transition-opacity hover:opacity-70"
          style={{ color: "var(--text-muted)" }}
        >
          Original ↗
        </a>

        <button
          onClick={(e) => { e.preventDefault(); onToggleRead(); }}
          className="ml-auto text-xs transition-opacity hover:opacity-70"
          style={{ color: "var(--text-muted)" }}
        >
          {isRead ? "Mark unread" : "Mark read"}
        </button>
      </div>
    </article>
  );
}
