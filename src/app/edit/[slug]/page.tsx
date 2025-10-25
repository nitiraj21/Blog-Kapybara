"use client";
import { trpc } from "@/utils/trpc";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function EditPostPage() {
  const router = useRouter();
  const { slug } = useParams() as { slug: string };
  const { data: post, isLoading } = trpc.post.getBySlug.useQuery({ slug });
  const updatePost = trpc.post.update.useMutation({
    onSuccess: () => {
      alert("Post updated successfully!");
      router.push("/");
    },
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setImageUrl(post.imageUrl ?? "");
    }
  }, [post]);

  if (isLoading) return <p className="p-8">Loading post...</p>;

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          updatePost.mutate({ slug, title, content, imageUrl });
        }}
        className="space-y-4"
      >
        <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Post Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter an engaging title for your post"
              required
              autoFocus
            />
          
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Image URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="image"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter an engaging title for your post"
              required
              autoFocus
            />
          
          </div>

          <div>
            
                      {/* Editor Controls */}
                      <div className="flex items-center justify-between border-b pb-3">
                        <label className="text-sm font-medium">
                          Content <span className="text-red-500">*</span>
                          <span className="text-gray-500 font-normal ml-2">(Markdown supported)</span>
                        </label>
                        <button
                          type="button"
                          className="px-4 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md font-medium"
                        >
                        </button>
                      </div>
            
                      {/* Editor/Preview Area */}
                      <div className="border border-gray-300 rounded-lg overflow-hidden">

                          <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={20}
                            className="w-full px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm"
                            placeholder="# Start writing your post...
            
            Write your content here using **Markdown** formatting.
            
            ## Supported Markdown:
            - **Bold** and *italic* text
            - Lists and numbered lists
            - [Links](https://example.com)
            - Code blocks and `inline code`
            - Headings, quotes, and more!
            
            ---
            
            Happy writing! 🚀"
                            required
                          />
                      </div>
            
                      {/* Markdown Quick Reference */}
                        <details className="text-sm bg-gray-50 rounded-lg">
                          <summary className="cursor-pointer px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                            📝 Markdown Quick Reference
                          </summary>
                          <div className="px-4 py-3 space-y-2 text-gray-600 font-mono text-xs">
                            <div><span className="text-blue-600"># Heading 1</span></div>
                            <div><span className="text-blue-600">## Heading 2</span></div>
                            <div><span className="text-blue-600">**bold text**</span></div>
                            <div><span className="text-blue-600">*italic text*</span></div>
                            <div><span className="text-blue-600">[link text](url)</span></div>
                            <div><span className="text-blue-600">- bullet list</span></div>
                            <div><span className="text-blue-600">1. numbered list</span></div>
                            <div><span className="text-blue-600">`inline code`</span></div>
                            <div><span className="text-blue-600">```code block```</span></div>
                            <div><span className="text-blue-600">&gt; blockquote</span></div>
                          </div>
                        </details>
          </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}
