import React from 'react'
import ReactMarkdown from 'react-markdown'
type PostProps = {
    post: {
      slug: string;
      title: string;
      content: string;
      published: boolean | null;
      author: string;
      imageUrl: string | null;
      id: number;
      createdAt: string | null;
    };
  };
export default function (post : PostProps ) 
{
  return (
    <div>
         <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Header Section */}
        <header className="mb-8">
          <div className='flex  items-center'>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {post.post.title}
            </h1>


          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <span>By {post.post.author}</span>
          </div>
        </header>

        {/* Featured Image */}
        {post.post.imageUrl && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img 
              src={post.post.imageUrl} 
              alt={post.post.title}
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
            {post.post.content}
          </ReactMarkdown>
        </div>

      </article>
    </div>
  )
}
