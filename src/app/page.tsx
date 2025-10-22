"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    fetch("/api/trpc/post.getAll").then(res => res.json()).then(console.log);
  }, []);

  return <main className="p-8">Open console and check the data output</main>;
}
