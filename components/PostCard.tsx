import Link from "next/link";
import type { Post } from "@/lib/feeds";
import { formatDate } from "@/lib/utils";

export function PostCard({ post, isRead }: { post: Post; isRead: boolean }) {
  return (
    <article
      className="rounded-xl p-6 border transition-opacity"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border)",
        opacity: isRead ? 0.55 : 1,
      }}
    >
      <div className="flex items-center gap-2 mb-3">
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
        {!isRead && (
          <span
            className="ml-auto w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: post.accentColor }}
          />
        )}
      </div>

      <h2
        className="font-semibold text-lg leading-snug mb-2"
        style={{ color: "var(--text)" }}
      >
        {post.title}
      </h2>

      <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-muted)" }}>
        {post.excerpt}
      </p>

      <div className="flex items-center gap-3">
        <Link
          href={`/post/${post.slug}`}
          className="text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
          style={{
            backgroundColor: post.accentColor,
            color: "#fff",
          }}
        >
          Read
        </Link>
        <a
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm transition-opacity hover:opacity-70"
          style={{ color: "var(--text-muted)" }}
        >
          View original ↗
        </a>
      </div>
    </article>
  );
}
