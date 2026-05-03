"use client";

import { useEffect } from "react";

export function MarkRead({ slug }: { slug: string }) {
  useEffect(() => {
    const read = JSON.parse(localStorage.getItem("read") || "[]");
    if (!read.includes(slug)) {
      localStorage.setItem("read", JSON.stringify([...read, slug]));
    }
  }, [slug]);
  return null;
}

export function useReadSlugs(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem("read") || "[]"));
  } catch {
    return new Set();
  }
}
