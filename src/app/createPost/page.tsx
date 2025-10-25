'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/utils/trpc';
import ReactMarkdown from 'react-markdown';

interface PostFormData {
  title: string;
  slug: string;
  author: string;
  imageUrl: string;
  description: string;
  content: string;
  published: boolean;
  categoryIds: number[];
}

export default function CreatePostForm() {
  const router = useRouter();
  const [step, setStep] = useState<'basic' | 'content'>('basic');
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    slug: '',
    author: '',
    imageUrl: '',
    content: '',
    description: '',
    published: false,
    categoryIds: [],
  });
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = trpc.category.getAll.useQuery();

  const createPostMutation = trpc.post.create.useMutation({
    onSuccess: () => {
      router.push('/');
    },
    onError: (error) => {
      setError(error.message || 'Failed to create post');
    },
  });

  const handleNext = () => {
    setError('');
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.author.trim()) {
      setError('Author is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    if (!formData.imageUrl.trim()) {
      setError('Image URL is required');
      return;
    }
    if (formData.categoryIds.length === 0) {
      setError('Please select at least one category');
      return;
    }
    
    setStep('content');
  };

  const handleBack = () => {
    setStep('basic');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }

    createPostMutation.mutate(formData);
  };

  const toggleCategory = (categoryId: number) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Create New Blog Post</h1>
        <div className="flex items-center gap-2 text-sm">
          <span className={`${step === 'basic' ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
            1. Basic Info
          </span>
          <span className="text-gray-400">→</span>
          <span className={`${step === 'content' ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
            2. Content
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {step === 'basic' && (
        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Post Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter an engaging title for your post"
              required
              autoFocus
            />
          </div>

          {/* Author */}
          <div>
            <label htmlFor="author" className="block text-sm font-medium mb-2">
              Author <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="author"
              value={formData.author}
              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter author name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Brief description of your post (2-3 sentences)"
              rows={3}
              required
            />
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium mb-2">
              Image URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
              required
            />
            {formData.imageUrl && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Image Preview:</p>
                <img 
                  src={formData.imageUrl} 
                  alt="Preview" 
                  className="w-full max-w-md h-48 object-cover rounded-lg shadow-sm"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Categories <span className="text-red-500">*</span>
            </label>
            {categoriesLoading ? (
              <div className="flex items-center gap-2 text-gray-500 py-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Loading categories...</span>
              </div>
            ) : categories && categories.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className={`flex items-center gap-2 px-4 py-3 border rounded-lg cursor-pointer transition-all ${
                        formData.categoryIds.includes(category.id)
                          ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium shadow-sm'
                          : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.categoryIds.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm">{category.name}</span>
                    </label>
                  ))}
                </div>
                {formData.categoryIds.length > 0 && (
                  <p className="mt-3 text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-md inline-block">
                    ✓ {formData.categoryIds.length} {formData.categoryIds.length === 1 ? 'category' : 'categories'} selected
                  </p>
                )}
              </>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 text-sm mb-2">
                  ⚠️ No categories available. Please create categories first.
                </p>
                <a 
                  href="/admin/categories" 
                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Go to Category Management →
                </a>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
            >
              Next: Add Content →
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {step === 'content' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Info Display */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg space-y-2">
            <p className="text-sm text-blue-600 font-medium">Creating post:</p>
            <h2 className="text-xl font-bold text-gray-900">{formData.title}</h2>
            <div className="flex flex-wrap gap-2">
              {categories
                ?.filter(c => formData.categoryIds.includes(c.id))
                .map(category => (
                  <span 
                    key={category.id}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {category.name}
                  </span>
                ))}
            </div>
          </div>

          {/* Editor Controls */}
          <div className="flex items-center justify-between border-b pb-3">
            <label className="text-sm font-medium">
              Content <span className="text-red-500">*</span>
              <span className="text-gray-500 font-normal ml-2">(Markdown supported)</span>
            </label>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md font-medium"
            >
              {showPreview ? '✏️ Edit' : '👁️ Preview'}
            </button>
          </div>

          {/* Editor/Preview Area */}
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            {!showPreview ? (
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={20}
                className="w-full px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm"
                placeholder="# Start writing your post...

Write your content here using **Markdown** formatting.

## Supported Markdown:
- **Bold** and *italic* text
- Lists and numbered lists
- [Links](https://example.com)
- Code blocks and `inline code`
- Headings, quotes, and more!

---

Happy writing! 🚀"
                required
              />
            ) : (
              <div className="px-4 py-3 min-h-[500px] prose prose-slate max-w-none">
                {formData.content ? (
                  <ReactMarkdown>{formData.content}</ReactMarkdown>
                ) : (
                  <p className="text-gray-400 italic">No content to preview yet...</p>
                )}
              </div>
            )}
          </div>

          {/* Markdown Quick Reference */}
          {!showPreview && (
            <details className="text-sm bg-gray-50 rounded-lg">
              <summary className="cursor-pointer px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                📝 Markdown Quick Reference
              </summary>
              <div className="px-4 py-3 space-y-2 text-gray-600 font-mono text-xs">
                <div><span className="text-blue-600"># Heading 1</span></div>
                <div><span className="text-blue-600">## Heading 2</span></div>
                <div><span className="text-blue-600">**bold text**</span></div>
                <div><span className="text-blue-600">*italic text*</span></div>
                <div><span className="text-blue-600">[link text](url)</span></div>
                <div><span className="text-blue-600">- bullet list</span></div>
                <div><span className="text-blue-600">1. numbered list</span></div>
                <div><span className="text-blue-600">`inline code`</span></div>
                <div><span className="text-blue-600">```code block```</span></div>
                <div><span className="text-blue-600">&gt; blockquote</span></div>
              </div>
            </details>
          )}

          {/* Navigation */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="submit"
              disabled={createPostMutation.isPending}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
            </button>
            <button
              type="button"
              onClick={handleBack}
              disabled={createPostMutation.isPending}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 font-medium"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              disabled={createPostMutation.isPending}
              className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50 font-medium ml-auto"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}