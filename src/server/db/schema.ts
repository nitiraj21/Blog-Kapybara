import { 
  integer,
  pgTable, 
  serial, 
  varchar, 
  text, 
  timestamp, 
  boolean,
} from 'drizzle-orm/pg-core';
import { relations } from "drizzle-orm";

export const posts = pgTable('posts', {
    id : serial('id').primaryKey(),
    title : varchar('title', {length : 255}).notNull(),
    slug : varchar('slug').notNull().unique(),
    content : text("content").notNull(),
    author : text("author").notNull().default('Anonymous'),
    imageUrl : text("imageUrl"),
    published : boolean("published").default(false),
    createdAt : timestamp("created_at").defaultNow()

})

export const categories = pgTable('categories',{
    id : serial('id').primaryKey(),
    name : text("name").notNull(),
    slug : text("slug").notNull(),
    description: text("description"),

})

export const postCategories = pgTable("post_categories", {
  postId: integer("post_id")
    .references(() => posts.id, { onDelete: "cascade" }),
  categoryId: integer("category_id")
    .references(() => categories.id, { onDelete: "cascade" }),
});


export const postRelations = relations(posts, ({ many }) => ({
    postCategories: many(postCategories),
  }));
  
  export const categoryRelations = relations(categories, ({ many }) => ({
    postCategories: many(postCategories),
  }));
  
  export const postCategoryRelations = relations(postCategories, ({ one }) => ({
    post: one(posts, {
      fields: [postCategories.postId],
      references: [posts.id],
    }),
    category: one(categories, {
      fields: [postCategories.categoryId],
      references: [categories.id],
    }),
  }));