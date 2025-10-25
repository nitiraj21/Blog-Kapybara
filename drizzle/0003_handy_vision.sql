ALTER TABLE "post_categories" DROP CONSTRAINT "post_categories_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "post_categories" DROP CONSTRAINT "post_categories_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "post_categories" ADD CONSTRAINT "post_categories_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_categories" ADD CONSTRAINT "post_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;