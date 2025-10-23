import { trpc } from '@/utils/trpc';
import React from 'react'

function Createpost() {

  const createPost = trpc.post.create.useMutation({
    onSuccess: () => alert("Post added! Refresh to see it."),
  });
  return (
    <main className="p-8 space-y-4">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => createPost.mutate({ title: "My second post", content: "please hire me", published: true })}
      >
        Add Test Post
      </button>
    </main>
  )
}

export default Createpost