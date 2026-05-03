import { fetchAllPosts } from "@/lib/feeds";
import { PostList } from "@/components/PostList";

export const revalidate = 3600;

export default async function Home() {
  const posts = await fetchAllPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold" style={{ color: "var(--text)" }}>
          Latest
        </h1>
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>
          {posts.length} post{posts.length !== 1 ? "s" : ""}
        </span>
      </div>
      {posts.length === 0 ? (
        <p className="text-center py-16" style={{ color: "var(--text-muted)" }}>
          No posts yet. Add some RSS feeds in <code>lib/sources.ts</code>.
        </p>
      ) : (
        <PostList posts={posts} />
      )}
    </div>
  );
}
