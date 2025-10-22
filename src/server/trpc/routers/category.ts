import { router, procedure } from "../index";
import { z } from "zod";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { categories } from "@/server/db/schema";
import slugify from "slugify";

export const categoryRouter = router({
  getAll: procedure.query(async () => {
    return await db.select().from(categories);
  }),

  create: procedure.input(
    z.object({ name: z.string().min(1), description: z.string().optional() })
  ).mutation(async ({ input }) => {
    const slug = slugify(input.name, { lower: true });
    await db.insert(categories).values({ ...input, slug });
    return { success: true };
  }),

  delete: procedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await db.delete(categories).where(eq(categories.id, input.id));
    return { success: true };
  }),
});
