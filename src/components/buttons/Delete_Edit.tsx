"use client"
import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/navigation'

interface DeleteEditProps {
  id: number;
  slug : string
}

export default function Delete_Edit({id, slug} : DeleteEditProps) {
  const router  = useRouter()
  const deletePost  = trpc.post.delete.useMutation({
    onSuccess : ()=>{
      alert("Post Deleted");
      router.push("/")
    }
  })

  return (
    <div className='flex justify-end gap-5 py-4'>
        <button
          onClick={()=>{router.push(`/edit/${slug}`)}}
        ><img src={"/edit.svg"} className='w-7 h-7 cursor-pointer'/></button>
        <button
        onClick={()=>{
          if (confirm("Delete this post?")) {
            console.log(id)
            deletePost.mutate({ id });
          }
        }}
        >
          <img src={"/delete.svg"} className='w-7 h-7 cursor-pointer'/></button>
    </div>
  )
}

