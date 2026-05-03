"use client";

import { useEffect, useMemo, useState } from "react";
import type { Post } from "@/lib/feeds";
import type { Review } from "./ReviewPanel";
import { PostCard } from "./PostCard";
import { SOURCES } from "@/lib/sources";

type Tab = "all" | "unread" | "starred";

function loadSet(key: string): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(key) || "[]"));
  } catch {
    return new Set();
  }
}

function saveSet(key: string, set: Set<string>) {
  localStorage.setItem(key, JSON.stringify([...set]));
}

function loadReviews(): Record<string, Review> {
  try {
    return JSON.parse(localStorage.getItem("reviews") || "{}");
  } catch {
    return {};
  }
}

export function PostList({ posts }: { posts: Post[] }) {
  const [readSlugs, setReadSlugs] = useState<Set<string>>(new Set());
  const [starredSlugs, setStarredSlugs] = useState<Set<string>>(new Set());
  const [reviews, setReviews] = useState<Record<string, Review>>({});
  const [tab, setTab] = useState<Tab>("unread");
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  function syncFromStorage() {
    setReadSlugs(loadSet("read"));
    setStarredSlugs(loadSet("starred"));
    setReviews(loadReviews());
  }

  useEffect(() => {
    syncFromStorage();
    // Re-sync when user navigates back (bfcache restore or tab switch)
    document.addEventListener("visibilitychange", syncFromStorage);
    return () => document.removeEventListener("visibilitychange", syncFromStorage);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function toggleRead(slug: string) {
    setReadSlugs((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      saveSet("read", next);
      return next;
    });
  }

  function toggleStar(slug: string) {
    setStarredSlugs((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      saveSet("starred", next);
      return next;
    });
  }

  const filtered = useMemo(() => {
    let result = posts;

    if (tab === "unread") result = result.filter((p) => !readSlugs.has(p.slug));
    if (tab === "starred") result = result.filter((p) => starredSlugs.has(p.slug));

    if (sourceFilter !== "all") result = result.filter((p) => p.source === sourceFilter);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.source.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q)
      );
    }

    return result;
  }, [posts, tab, readSlugs, starredSlugs, sourceFilter, search]);

  const unreadCount = posts.filter((p) => !readSlugs.has(p.slug)).length;
  const starredCount = posts.filter((p) => starredSlugs.has(p.slug)).length;

  const tabStyle = (t: Tab) => ({
    color: tab === t ? "var(--text)" : "var(--text-muted)",
    borderBottom: tab === t ? "2px solid var(--text)" : "2px solid transparent",
    fontWeight: tab === t ? 600 : 400,
  } as React.CSSProperties);

  return (
    <div>
      {/* Search */}
      <input
        type="search"
        placeholder="Search posts…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-2 rounded-lg text-sm border outline-none"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border)",
          color: "var(--text)",
        }}
      />

      {/* Tabs + source filter */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-4">
          {(["all", "unread", "starred"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="text-sm pb-1 capitalize transition-colors"
              style={tabStyle(t)}
            >
              {t}
              {t === "unread" && unreadCount > 0 && (
                <span className="ml-1 text-xs opacity-60">({unreadCount})</span>
              )}
              {t === "starred" && starredCount > 0 && (
                <span className="ml-1 text-xs opacity-60">({starredCount})</span>
              )}
            </button>
          ))}
        </div>

        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="text-xs px-2 py-1 rounded-md border outline-none"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border)",
            color: "var(--text-muted)",
          }}
        >
          <option value="all">All sources</option>
          {SOURCES.map((s) => (
            <option key={s.name} value={s.name}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <p className="text-sm text-center py-12" style={{ color: "var(--text-muted)" }}>
          {tab === "starred"
            ? "No starred posts yet. Click ☆ on any card to save it."
            : tab === "unread"
            ? "All caught up!"
            : "No posts match your filter."}
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((post) => (
            <PostCard
              key={post.slug}
              post={post}
              isRead={readSlugs.has(post.slug)}
              isStarred={starredSlugs.has(post.slug)}
              review={reviews[post.slug]}
              onToggleRead={() => toggleRead(post.slug)}
              onToggleStar={() => toggleStar(post.slug)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
