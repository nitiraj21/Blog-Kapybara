import { router, procedure } from "../index";
import { z } from "zod";
import { db } from "@/server/db";
import { posts } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import slugify from "slugify";

export const postRouter = router({
  getAll: procedure.query(async () => {
    return await db.select().from(posts);
  }),

  getBySlug: procedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    const [post] = await db.select().from(posts).where(eq(posts.slug, input.slug));

    return post;
  }),

  create: procedure.input(
    z.object({
      title: z.string().min(1),
      content: z.string().min(1),
      published: z.boolean().default(false),
    })
  ).mutation(async ({ input }) => {
    const slug = slugify(input.title, { lower: true }) + "-" + Date.now();
    await db.insert(posts).values({ ...input, slug });
    return { success: true };
  }),

  delete: procedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await db.delete(posts).where(eq(posts.id, input.id));
    return { success: true };
  }),
});
