'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/utils/trpc';
import ReactMarkdown from 'react-markdown';

interface PostFormData {
  title: string;
  slug : string,
  user : string,
  description : string,
  content: string;
  published: boolean;
}

export default function CreatePostForm() {
  const router = useRouter();
  const [step, setStep] = useState<'basic' | 'content'>('basic');
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    slug : '',
    user : '',
    content: '',
    description : '',
    published: false,
  });
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');

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
            
            <p className="text-sm text-gray-500 mt-2">
              A unique slug will be auto-generated: <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{formData.title ? `${formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}` : 'your-title-timestamp'}</span>
            </p>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              User <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="user"
              value={formData.user}
              onChange={(e) => setFormData(prev => ({ ...prev, user: e.target.value }))}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter an engaging title for your post"
              required
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="description"
              value={formData.user}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter an engaging title for your post"
              required
              autoFocus
            />
          </div>

          

          {/* Published Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 mt-0.5"
              />
              <div>
                <span className="text-sm font-medium block">Publish immediately</span>
                <span className="text-sm text-gray-600">
                  {formData.published 
                    ? 'Post will be visible to everyone after creation' 
                    : 'Post will be saved as a draft'}
                </span>
              </div>
            </label>
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
          {/* Post Title Display */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium mb-1">Creating post:</p>
            <h2 className="text-xl font-bold text-gray-900">{formData.title}</h2>
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
              disabled={createPostMutation.isLoading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {createPostMutation.isLoading ? 'Creating...' : '✓ Create Post'}
            </button>
            <button
              type="button"
              onClick={handleBack}
              disabled={createPostMutation.isLoading}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 font-medium"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              disabled={createPostMutation.isLoading}
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