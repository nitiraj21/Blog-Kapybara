# Blogr Kapybara

Blogr is a full-stack, type-safe blog platform built with Next.js, tRPC, Drizzle ORM, and PostgreSQL. It features complete CRUD functionality for posts and categories, a dynamic masonry layout, and Markdown support.


## Live Link 
[https://blog-kapybara.vercel.app/](https://blog-kapybara.vercel.app/)
    
## Features Implemented

### Priority 1: Post Management
* [x] **View All Posts:** Homepage displays all posts in a responsive masonry layout.
* [x] **View Single Post:** Detailed post view with full content rendering./page.tsx
* [x] **Create Post:** A multi-step form for creating new posts, including title, author, image, description, and content.
* [x] **Edit Post:** Ability to edit a post's title, image URL, and content./page.tsx,
* [x] **Delete Post:** Functionality to delete posts directly from the post page.

### Priority 2: Category Management
* [x] **Create Categories:** A dedicated UI to create new categories with a name and description.
* [x] **Manage Categories:** Edit and delete existing categories from a central management page.
* [x] **Assign Categories:** Assign one or more categories to a post during creation.
* [x] **Filter by Category:** View all posts belonging to a specific category via the navbar or URL

### Priority 3: Styling & UX
* [x] **Masonry Layout:** Uses GSAP for an animated, responsive masonry grid on post listing pages.
* [x] **Markdown Support:** Posts are written in Markdown and rendered as HTML in both the create-post preview and the final post page.
* [x] **Navigation:** A responsive navbar provides links to home, create post, and a dynamic category dropdown.
* [x] **Loading States:** Implemented loading spinners and messages while data is being fetched
* [x] **Form Validation:** Client-side validation ensures required fields are filled before submitting forms.

---

## Tech Stack

* **Framework:** **Next.js 16** (App Router)
* **API & Type-Safety:** **tRPC** (end-to-end type-safe APIs)
* **Database:** **PostgreSQL**
* **ORM:** **Drizzle ORM** (with Drizzle Kit for migrations)
* **Styling:** **Tailwind CSS**
* **UI Components:** **React**, `lucide-react` (icons), ShadCN UI
* **Server State:** **@tanstack/react-query** (via tRPC)
* **Content:** **`react-markdown`** (for rendering post content)
* **Animations:** **GSAP** (for masonry layout)

---

## Setup Steps (How to Run Locally)

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/nitiraj21/blog-kapybara.git
    cd blog-kapybara
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables**
    Create a `.env` file in the root of the project and add your PostgreSQL connection string:
    ```.env
    DATABASE_URL="postgresql://user:password@host:port/database"
    ```
    This is required by Drizzle to connect to your database.

4.  **Run Database Migrations**
    Run the Drizzle Kit migrations to set up your database schema:
    ```bash
    npx drizzle-kit push
    ```

5.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

---

## tRPC Architecture

This project leverages tRPC for end-to-end type-safe API development.

1.  **Server Initialization:** The tRPC server is initialized in `src/server/trpc/index.ts`.
2.  **Routers:** API logic is modularized into routers:
    * `src/server/trpc/routers/posts.ts`: Handles all CRUD operations for posts.
    * `src/server/trpc/routers/category.ts`: Handles all CRUD operations for categories.
3.  **Root Router:** These routers are combined into a single `appRouter` in `src/server/trpc/root.ts`.
4.  **API Handler:** The `appRouter` is exposed as a Next.js API route in `src/app/api/trpc/[trpc]/route.ts`./route.ts]
5.  **Client Configuration:** A type-safe client is created in `src/utils/trpc.ts`.
6.  **Provider:** The entire application is wrapped in a `TrpcProvider` in `src/app/layout.tsx` (defined in `src/components/provider/trpc_provider.tsx`), which provides the tRPC client and React Query context to all components.

This setup allows you to call backend procedures from your frontend components with full autocompletion and type-checking, as if you were calling a local function.



## Time Spent
* **Actual Time:** 7 Hours
