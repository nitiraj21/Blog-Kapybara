'use client'
import Delete_Edit from '@/components/buttons/Delete_Edit';
import { trpc } from '@/utils/trpc';
import { useParams } from 'next/navigation';
import React from 'react';
import ReactMarkdown from 'react-markdown';


export default function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: post, isLoading } = trpc.post.getBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center gap-2 text-gray-500 py-4 h-screen">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      <span>Loading ...</span>
    </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Post Not Found</h1>
          <p className="text-gray-600">The blog post you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray px-20">
        <Delete_Edit id={post.id} slug={post.slug} />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Header Section */}
        <header className="mb-8">
          <div className='flex  items-center'>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>


          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <span>By {post.author}</span>
          </div>
        </header>

        {/* Featured Image */}
        {post.imageUrl && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img 
              src={post.imageUrl} 
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Content Section */}
        <div className="prose prose-lg prose-gray max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-gray-700 leading-relaxed mb-4">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-4 text-gray-700 space-y-2">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-4 text-gray-700 space-y-2">
                  {children}
                </ol>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">
                  {children}
                </blockquote>
              ),
              code: ({  children }) =>
                 (
                  <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono my-4">
                    {children}
                  </code>
                ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-blue-600 hover:text-blue-800 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              img: ({ src, alt }) => (
                <img
                  src={src}
                  alt={alt}
                  className="w-full h-auto rounded-lg my-6"
                />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

      </article>
    </div>
  );
}