"use client";
import Createpost from "@/components/buttons/Createpost";
import Masonry from "@/components/masonry/Masonry";
import { categories, postCategories } from "@/server/db/schema";
import { trpc } from "@/utils/trpc";

type Item = {
  id: string;
  title : string;
  img: string;
  url: string;
  height: number;
  slug : string;
  categories: string[];
};

export default function Home() {
  const { data: posts, isLoading } = trpc.post.getAll.useQuery();

  if (isLoading) return <p className="p-8">Loading posts...</p>;
  if(!isLoading){
    console.log(posts)
  }

  const items: Item[] = posts?.map((p) => ({
    id: p.id.toString(),
    title: p.title,
    img: "https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcm0yMThiYXRjaDQta2F0aWUtMTcuanBn.jpg",
    url: `/post/${p.slug}`,
    height: 600 + Math.floor(Math.random() * 150),
    slug: p.slug, // aesthetic height variation
    categories: p.postCategories.map((pc) => pc.category?.name || "Unknown")
  })) || [];

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-3xl font-bold mb-6">All Posts</h1>
      <Createpost></Createpost>
      {!posts?.length && <p>No posts yet.</p>}
      <Masonry
        items={items}
        ease="power3.out"
        duration={0.6}
        stagger={0.05}
        animateFrom="bottom"
        scaleOnHover={true}
        hoverScale={0.95}
        blurToFocus={true}
        colorShiftOnHover={false}
/>
    </main>
  );
}
