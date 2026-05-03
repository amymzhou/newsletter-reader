import { fetchAllPosts } from "@/lib/feeds";
import { PostList } from "@/components/PostList";

export const revalidate = 3600;

export default async function Home() {
  const posts = await fetchAllPosts();

  return posts.length === 0 ? (
    <p className="text-center py-16" style={{ color: "var(--text-muted)" }}>
      No posts yet. Add some RSS feeds in <code>lib/sources.ts</code>.
    </p>
  ) : (
    <PostList posts={posts} />
  );
}
