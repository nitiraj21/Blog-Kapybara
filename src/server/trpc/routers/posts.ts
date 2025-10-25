import { router, procedure } from "../index";
import { z } from "zod";
import { db } from "@/server/db";
import { postCategories, posts } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import slugify from "slugify";

export const postRouter = router({
  getAll: procedure
    .input(
      z.object({
        categorySlug: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const allPosts = await db.query.posts.findMany({
        with: {
          postCategories: {
            with: { category: true },
          },
        },
        orderBy: (posts, { desc }) => [desc(posts.createdAt)],
      });

      // If no category filter, return all
      if (!input?.categorySlug || input.categorySlug === 'all') {
        return allPosts;
      }

      // Filter posts that have the specified category
      return allPosts.filter(post =>
        post.postCategories.some(pc => pc.category?.slug === input.categorySlug)
      );
    }),

  getBySlug: procedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const [post] = await db.select().from(posts).where(eq(posts.slug, input.slug));
      return post;
    }),

  create: procedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        published: z.boolean().default(false),
        author: z.string().min(1),
        imageUrl: z.string().url().min(1),
        description: z.string().min(1),
        categoryIds: z.array(z.number()).min(1, "At least one category is required"),
      })
    )
    .mutation(async ({ input }) => {
      // Generate slug from title
      const slug = slugify(input.title, { lower: true, strict: true }) + "-" + Date.now();

      // Extract categoryIds from input
      const { categoryIds, ...postData } = input;

      // Insert the post
      const [newPost] = await db
        .insert(posts)
        .values({ ...postData, slug })
        .returning();

      // Insert post-category relationships
      if (categoryIds.length > 0) {
        await db.insert(postCategories).values(
          categoryIds.map(categoryId => ({
            postId: newPost.id,
            categoryId: categoryId,
          }))
        );
      }

      return { success: true, post: newPost };
    }),

  delete: procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      // Delete post-category relationships first (cascade should handle this, but being explicit)
      await db.delete(postCategories).where(eq(postCategories.postId, input.id));
      
      // Delete the post
      await db.delete(posts).where(eq(posts.id, input.id));
      
      return { success: true };
    }),

  update: procedure
  .input(
    z.object({
      slug: z.string(),            // post to update
      title: z.string().optional(),
      content: z.string().optional(),
      imageUrl: z.string().optional(),
      published: z.boolean().optional(),
    })
  )
  .mutation(async ({ input }) => {
    const { slug, ...data } = input;

    const updated = await db
      .update(posts)
      .set(data)
      .where(eq(posts.slug, slug))
      .returning();

    if (!updated.length) throw new Error("Post not found");
    return { success: true, post: updated[0] };
  }),

});
