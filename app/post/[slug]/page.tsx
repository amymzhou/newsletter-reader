import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchAllPosts } from "@/lib/feeds";
import { Reader } from "@/components/Reader";
import { MarkRead } from "@/components/ReadTracker";
import { formatDate } from "@/lib/utils";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await fetchAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await fetchAllPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article className="mx-auto" style={{ maxWidth: "68ch" }}>
      <MarkRead slug={post.slug} />

      <div className="mb-8">
        <Link
          href="/"
          className="text-sm transition-opacity hover:opacity-70 inline-flex items-center gap-1 mb-6"
          style={{ color: "var(--text-muted)" }}
        >
          ← Back
        </Link>

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
        </div>

        <h1
          className="text-2xl font-bold leading-tight mb-6"
          style={{ color: "var(--text)" }}
        >
          {post.title}
        </h1>

        <div
          className="h-px mb-8"
          style={{ backgroundColor: "var(--border)" }}
        />
      </div>

      <Reader content={post.content} />

      <footer className="mt-12 pt-6 border-t flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
        <Link
          href="/"
          className="text-sm transition-opacity hover:opacity-70"
          style={{ color: "var(--text-muted)" }}
        >
          ← Back to feed
        </Link>
        <a
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: post.accentColor }}
        >
          View original ↗
        </a>
      </footer>
    </article>
  );
}
