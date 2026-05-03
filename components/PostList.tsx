"use client";

import { useEffect, useState } from "react";
import type { Post } from "@/lib/feeds";
import { PostCard } from "./PostCard";

export function PostList({ posts }: { posts: Post[] }) {
  const [readSlugs, setReadSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("read") || "[]");
      setReadSlugs(new Set(stored));
    } catch {
      setReadSlugs(new Set());
    }
  }, []);

  const unread = posts.filter((p) => !readSlugs.has(p.slug));
  const read = posts.filter((p) => readSlugs.has(p.slug));
  const sorted = [...unread, ...read];

  return (
    <div className="flex flex-col gap-4">
      {unread.length === 0 && posts.length > 0 && (
        <p className="text-sm text-center py-6" style={{ color: "var(--text-muted)" }}>
          All caught up! {read.length} post{read.length !== 1 ? "s" : ""} read.
        </p>
      )}
      {sorted.map((post) => (
        <PostCard key={post.slug} post={post} isRead={readSlugs.has(post.slug)} />
      ))}
    </div>
  );
}
