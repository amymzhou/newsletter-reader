"use client";

import { useEffect, useRef, useState } from "react";

export type Review = {
  rating: number;
  note: string;
};

function loadReviews(): Record<string, Review> {
  try {
    return JSON.parse(localStorage.getItem("reviews") || "{}");
  } catch {
    return {};
  }
}

function saveReview(slug: string, review: Review) {
  const all = loadReviews();
  all[slug] = review;
  localStorage.setItem("reviews", JSON.stringify(all));
}

export function ReviewPanel({ slug, accentColor }: { slug: string; accentColor: string }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const reviews = loadReviews();
    if (reviews[slug]) {
      setRating(reviews[slug].rating);
      setNote(reviews[slug].note);
    }
  }, [slug]);

  function handleRating(r: number) {
    const next = r === rating ? 0 : r; // click same star to clear
    setRating(next);
    saveReview(slug, { rating: next, note });
    flash();
  }

  function handleNote(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setNote(val);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      saveReview(slug, { rating, note: val });
      flash();
    }, 600);
  }

  function flash() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div
      className="mt-10 pt-8 border-t"
      style={{ borderColor: "var(--border)" }}
    >
      <h3
        className="text-sm font-semibold uppercase tracking-wide mb-4"
        style={{ color: "var(--text-muted)" }}
      >
        Your notes
      </h3>

      {/* Star rating */}
      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => handleRating(star)}
            aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
            className="text-2xl transition-all"
            style={{
              color: star <= (hover || rating) ? accentColor : "var(--border)",
              transform: star <= (hover || rating) ? "scale(1.15)" : "scale(1)",
            }}
          >
            ★
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-xs" style={{ color: "var(--text-muted)" }}>
            {["", "Not for me", "OK", "Pretty good", "Loved it", "Must read"][rating]}
          </span>
        )}
      </div>

      {/* Note */}
      <textarea
        value={note}
        onChange={handleNote}
        placeholder="What did you think? Key takeaways, ideas, things to follow up on…"
        rows={4}
        className="w-full text-sm rounded-lg px-4 py-3 border resize-none outline-none transition-colors"
        style={{
          backgroundColor: "var(--bg)",
          borderColor: "var(--border)",
          color: "var(--text)",
          lineHeight: "1.6",
        }}
      />

      <p
        className="mt-1 text-xs transition-opacity"
        style={{
          color: "var(--text-muted)",
          opacity: saved ? 1 : 0,
        }}
      >
        Saved
      </p>
    </div>
  );
}
