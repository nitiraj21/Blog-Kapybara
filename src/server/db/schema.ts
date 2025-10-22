import { 
  integer,
  pgTable, 
  serial, 
  varchar, 
  text, 
  timestamp, 
  boolean,
  primaryKey 
} from 'drizzle-orm/pg-core';
import { title } from 'process';

export const posts = pgTable('posts', {
    id : serial('id').primaryKey(),
    title : varchar('title', {length : 255}).notNull(),
    slug : varchar('slug').notNull().unique(),
    content : text("content").notNull(),
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
    postId : integer("post_id").references(()=> posts.id),
    categoryId: integer("category_id").references(() => categories.id),
})