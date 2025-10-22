import { router } from "./index";
import { postRouter } from "./routers/posts";
import { categoryRouter } from "./routers/category";

export const appRouter = router({
  post: postRouter,
  category: categoryRouter,
});

export type AppRouter = typeof appRouter;
