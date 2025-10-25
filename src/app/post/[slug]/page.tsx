'use client'
import Delete_Edit from '@/components/buttons/Delete_Edit';
import Post from '@/components/Post/Post';
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
        <Post post = {post}/>
     
    </div>
  );
}