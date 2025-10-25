'use client'
import { trpc } from '@/utils/trpc';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Fetch categories from database
  const { data: categories, isLoading } = trpc.category.getAll.useQuery();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 mx-130 rounded-2xl mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className='flex justify-center items-center gap-2'>
                <img src={"/BlogrIcon.png"} height={45} width={45}/>
                <span className='text-lg font-semibold text-gray-600'>Blogr</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Home Link */}
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Home
            </Link>

            {/* Create Post Link */}
            <Link
              href="/createPost"
              className={`text-sm font-medium transition-colors ${
                isActive('/create')
                  ? 'text-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Create Post
            </Link>

            {/*Manage Categories Link*/}
            <Link
              href="/category/create"
              className={`text-sm font-medium transition-colors ${
                isActive('/create')
                  ? 'text-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Manage Categories
            </Link>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Categories
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>

              {/* Dropdown Menu */}
              {isCategoryDropdownOpen && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsCategoryDropdownOpen(false)}
                  />
                  
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-100">
                    {isLoading ? (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        Loading categories...
                      </div>
                    ) : categories && categories.length > 0 ? (
                      <>
                        <Link
                          href="/"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setIsCategoryDropdownOpen(false)}
                        >
                          All Posts
                        </Link>
                        {categories.map((category) => (
                          <Link
                            key={category.id}
                            href={`/category/${category.slug}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            onClick={() => setIsCategoryDropdownOpen(false)}
                          >
                            {category.name}
                          </Link>
                        ))}
                      </>
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        No categories found
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-3">
            {/* Home Link */}
            <Link
              href="/"
              className={`block py-2 text-base font-medium ${
                isActive('/')
                  ? 'text-blue-600'
                  : 'text-gray-700'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>

            {/* Create Post Link */}
            <Link
              href="/create"
              className={`block py-2 text-base font-medium ${
                isActive('/create')
                  ? 'text-blue-600'
                  : 'text-gray-700'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Create Post
            </Link>

            {/* Categories Section */}
            <div className="pt-2 border-t border-gray-200">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Categories
              </div>
              {isLoading ? (
                <div className="text-sm text-gray-500">Loading...</div>
              ) : categories && categories.length > 0 ? (
                <>
                  <Link
                    href="/"
                    className="block py-2 text-base text-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    All Posts
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="block py-2 text-base text-gray-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </>
              ) : (
                <div className="text-sm text-gray-500">No categories found</div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}