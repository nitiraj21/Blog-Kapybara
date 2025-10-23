"use client";
import Createpost from "@/components/buttons/Createpost";
import { trpc } from "@/utils/trpc";

export default function Home() {
  const { data: posts, isLoading } = trpc.post.getAll.useQuery();

  if (isLoading) return <p className="p-8">Loading posts...</p>;

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-3xl font-bold mb-6">All Posts</h1>
      <Createpost></Createpost>
      {!posts?.length && <p>No posts yet.</p>}

      <ul className="space-y-2">
        {posts?.map((p) => (
          <li key={p.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{p.title}</h2>
            <p className="text-gray-500 text-sm">{p.slug}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
