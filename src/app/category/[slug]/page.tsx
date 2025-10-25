"use client";
import Masonry from "@/components/masonry/Masonry";
import { categories, postCategories } from "@/server/db/schema";
import { trpc } from "@/utils/trpc";
import { useParams, useSearchParams } from "next/navigation";

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
    const params  = useParams()
    const selectedCategory = params.slug as string
  
    const { data: posts, isLoading } = trpc.post.getAll.useQuery({
      categorySlug: selectedCategory
    });
  

  if (isLoading) return(
    <div className="flex justify-center items-center h-screen gap-3">
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
    <span>Loading ...</span>
  </div>
  )
  if(!isLoading){
    console.log(posts)
  }

  const items: Item[] = posts?.map((p) => ({
    id: p.id.toString(),
    title: p.title,
    img: p.imageUrl || "",
    url: `/post/${p.slug}`,
    height: 600 + Math.floor(Math.random() * 150),
    slug: p.slug, // aesthetic height variation
    categories: p.postCategories.map((pc) => pc.category?.name || "Unknown")
  })) || [];


  if(posts?.length == 0){
    return(
      <div className="flex justify-center items-center h-screen">
        No Posts on this Topic Yet
      </div>
    )
  }

  return (
    <main className="p-8 space-y-4">
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
