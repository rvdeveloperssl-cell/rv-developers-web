import { useEffect, useRef, useState } from 'react';
import { Search, Clock, User, ArrowRight, Tag } from 'lucide-react';
import { mockBlogPosts } from '@/data/mockData';

interface BlogProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

const categories = ['All', 'Security', 'Performance', 'DevOps', 'Best Practices', 'Technology'];

export default function Blog({ onNavigate: _onNavigate }: BlogProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const filteredPosts = mockBlogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || post.tags.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Featured post (first post)
  const featuredPost = mockBlogPosts[0];
  const regularPosts = filteredPosts.filter((p) => p.id !== featuredPost?.id);

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <section className="rv-container mb-12">
        <div className="text-center max-w-3xl mx-auto">
          <span className="rv-badge mb-4">Blog</span>
          <h1 className="text-4xl lg:text-6xl font-bold text-[#F4F6FF] mt-4 mb-6">
            Insights &{' '}
            <span className="rv-text-gradient">Updates</span>
          </h1>
          <p className="text-lg text-[#A7ACB8]">
            Stay updated with the latest trends, best practices, and insights from our team.
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="rv-container mb-12">
        <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A7ACB8]" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rv-input pl-12"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#4F46E5] text-white'
                    : 'bg-[rgba(244,246,255,0.05)] text-[#A7ACB8] hover:bg-[rgba(244,246,255,0.1)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {!searchQuery && selectedCategory === 'All' && featuredPost && (
        <section ref={sectionRef} className="rv-container mb-16">
          <div
            className={`rv-card overflow-hidden cursor-pointer group transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <div className="grid lg:grid-cols-2">
              <div className="relative aspect-video lg:aspect-auto overflow-hidden">
                <img
                  src={featuredPost.imageUrl}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  {featuredPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-[rgba(79,70,229,0.15)] text-[#4F46E5] text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-[#F4F6FF] mb-4 group-hover:text-[#4F46E5] transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-[#A7ACB8] mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-6 text-sm text-[#A7ACB8]">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime} min read
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="rv-container">
        <h2 className="text-2xl font-bold text-[#F4F6FF] mb-8">
          {searchQuery || selectedCategory !== 'All' ? 'Search Results' : 'Latest Articles'}
        </h2>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <Tag className="w-16 h-16 text-[#A7ACB8] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#F4F6FF] mb-2">No articles found</h3>
            <p className="text-[#A7ACB8]">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post, index) => (
              <article
                key={post.id}
                className={`rv-card group cursor-pointer transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E16] via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded bg-[rgba(79,70,229,0.15)] text-[#4F46E5]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-lg font-semibold text-[#F4F6FF] mb-2 group-hover:text-[#4F46E5] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#A7ACB8] mb-4 line-clamp-2">{post.excerpt}</p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-[#A7ACB8]">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime} min</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="rv-container mt-20">
        <div className="rv-panel p-12 text-center">
          <h2 className="text-2xl font-bold text-[#F4F6FF] mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-[#A7ACB8] max-w-xl mx-auto mb-6">
            Get the latest articles and insights delivered directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="rv-input flex-grow"
            />
            <button className="rv-btn-primary flex items-center justify-center gap-2">
              Subscribe
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
