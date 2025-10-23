'use client'
import { trpc } from '@/utils/trpc';
import { useParams } from 'next/navigation';
import React from 'react'
import ReactMarkdown from 'react-markdown';

export default function page() {
    const params = useParams();
    const slug = params.slug as string;
    const { data: post, isLoading } = trpc.post.getBySlug.useQuery({ slug: slug});
  return (
    <div>
      <h1>{post?.createdAt}</h1>
      <ReactMarkdown>{post?.content}</ReactMarkdown>
    </div>
  )
}
