import React, { useState, useEffect } from "react";
import { Box, Page, Text, Input, Tabs } from "zmp-ui";
import { Search, Bookmark, Clock, ThumbsUp, User, Calendar, TrendingUp, Zap, Briefcase, Microscope, Newspaper } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const BlogPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const BASE_URL = "https://harmless-right-chipmunk.ngrok-free.app/api/news";

  const fetchNewsData = async (category = "all", query = "", page = 1, append = false) => {
    try {
      if (!append) {
        setLoading(true);
        setError(null); 
      }

      const pageSize = 10;
      let url;
      
      if (query.trim()) {
        const encodedQuery = encodeURIComponent(query);
        url = `${BASE_URL}/search?query=${encodedQuery}&category=${category !== 'all' ? category : ''}&pageSize=${pageSize}&page=${page}`;
      } else {
        switch(category) {
          case "trending":
            url = `${BASE_URL}/top-headlines?country=us&pageSize=${pageSize}&page=${page}`;
            break;
          case "tech":
            url = `${BASE_URL}/everything?q=technology OR programming OR AI OR software&language=en&pageSize=${pageSize}&page=${page}&sortBy=publishedAt`;
            break;
          case "business":
            url = `${BASE_URL}/top-headlines?category=business&country=us&pageSize=${pageSize}&page=${page}`;
            break;
          case "science":
            url = `${BASE_URL}/top-headlines?category=science&country=us&pageSize=${pageSize}&page=${page}`;
            break;
          case "all":
          default:
            url = `${BASE_URL}/everything?language=en&pageSize=${pageSize}&page=${page}&sortBy=publishedAt`;
            break;
        }
      }
      
      console.log("Fetching URL:", url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
      });
      
      const contentType = response.headers.get('content-type');
      
      if (!response.ok) {
        const responseText = await response.text();
        console.log("Error response:", responseText);
        
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = JSON.parse(responseText);
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
          } catch (parseError) {
            throw new Error(`HTTP ${response.status}: ${responseText.substring(0, 200)}...`);
          }
        } else {
          throw new Error(`HTTP ${response.status}: Expected JSON but got ${contentType || 'unknown'}`);
        }
      }
      
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        throw new Error(`Expected JSON response but got ${contentType || 'unknown'}. Response: ${responseText.substring(0, 200)}...`);
      }
      
      const data = await response.json();
      console.log("Response data:", data);

      if (data.status === "error") {
        throw new Error(data.message || 'Unknown API error');
      }

      const transformedArticles = (data.articles || [])
        .filter(article => article.title && article.description && article.title !== "[Removed]")
        .map((article, index) => ({
          id: `${page}-${index}-${article.publishedAt}`, 
          title: article.title,
          summary: article.description,
          coverImage: article.urlToImage || 'https://via.placeholder.com/400x225/f3f4f6/6b7280?text=No+Image',
          category: getCategoryFromContent(article.title + " " + article.description, article.source?.name || ''),
          author: article.author || article.source?.name || "Unknown",
          publishDate: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('vi-VN') : '',
          readingTime: estimateReadingTime(article.description || ''),
          likes: Math.floor(Math.random() * 500) + 50,
          comments: Math.floor(Math.random() * 100) + 5,
          bookmarked: false,
          url: article.url,
          source: article.source?.name || 'Unknown'
        }));

      if (append) {
        setBlogs(prevBlogs => [...prevBlogs, ...transformedArticles]);
      } else {
        setBlogs(transformedArticles);
      }

      setHasMore(transformedArticles.length === pageSize);
      
    } catch (error) {
      console.error("Detailed error:", error);
      setError(error.message);
      if (!append) {
        setBlogs([]); 
      }
    } finally {
      setLoading(false);
    }
  };

  const estimateReadingTime = (text) => {
    if (!text) return "1 phút";
    const wordsPerMinute = 200;
    const wordCount = text.split(' ').length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} phút`;
  };

  const getCategoryFromContent = (content, source) => {
    const lowerContent = content.toLowerCase();
    const lowerSource = source.toLowerCase();
    
    const techKeywords = ['technology', 'tech', 'ai', 'software', 'programming', 'blockchain', 'crypto', 'startup'];
    const businessKeywords = ['business', 'market', 'finance', 'economy', 'stock', 'company'];
    const scienceKeywords = ['science', 'research', 'study', 'discovery', 'scientific'];
    
    if (techKeywords.some(keyword => lowerContent.includes(keyword) || lowerSource.includes(keyword))) {
      return 'tech';
    }
    
    if (businessKeywords.some(keyword => lowerContent.includes(keyword) || lowerSource.includes(keyword))) {
      return 'business';
    }
    
    if (scienceKeywords.some(keyword => lowerContent.includes(keyword) || lowerSource.includes(keyword))) {
      return 'science';
    }
    
    return 'news';
  };

  useEffect(() => {
    setCurrentPage(1);
    setSearchQuery(""); 
    fetchNewsData(activeTab, "", 1, false);
  }, [activeTab]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchNewsData(activeTab, searchQuery, 1, false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleToggleBookmark = (blogId) => {
    setBlogs(prevBlogs =>
      prevBlogs.map((blog) =>
        blog.id === blogId
          ? { ...blog, bookmarked: !blog.bookmarked }
          : blog
      )
    );
  };

  const handleLikeBlog = (blogId) => {
    setBlogs(prevBlogs =>
      prevBlogs.map((blog) =>
        blog.id === blogId
          ? { ...blog, likes: blog.likes + 1 }
          : blog
      )
    );
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) { 
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchNewsData(activeTab, searchQuery, nextPage, true);
    }
  };

  const handleBlogClick = (blog) => {
    window.open(blog.url, '_blank');
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'tech': return <Zap className="w-4 h-4" />;
      case 'business': return <Briefcase className="w-4 h-4" />;
      case 'science': return <Microscope className="w-4 h-4" />;
      default: return <Newspaper className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'tech': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'business': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'science': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      default: return 'bg-gradient-to-r from-orange-500 to-red-500 text-white';
    }
  };

  const getCategoryName = (category) => {
    switch(category) {
      case 'tech': return 'Công nghệ';
      case 'business': return 'Kinh doanh';
      case 'science': return 'Khoa học';
      default: return 'Tin tức';
    }
  };

  const renderSkeletonCard = (key) => (
    <div key={key} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="aspect-video bg-gray-200 animate-pulse" />
      <div className="p-6 space-y-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 bg-gray-200 rounded animate-pulse w-4/5" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        </div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
        </div>
      </div>
    </div>
  );

  const renderBlogCard = (blog) => (
    <div 
      key={blog.id} 
      className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
      onClick={() => handleBlogClick(blog)}
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={blog.coverImage} 
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x225/f3f4f6/6b7280?text=No+Image';
          }}
        />
        
        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 backdrop-blur-sm ${getCategoryColor(blog.category)}`}>
          {getCategoryIcon(blog.category)}
          {getCategoryName(blog.category)}
        </div>
        
        <button 
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 group-hover:scale-110"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleBookmark(blog.id);
          }}
        >
          <Bookmark 
            className={`w-5 h-5 transition-colors duration-200 ${
              blog.bookmarked ? 'fill-blue-500 text-blue-500' : 'text-gray-600 hover:text-blue-500'
            }`}
          />
        </button>

        {blog.likes > 300 && (
          <div className="absolute bottom-4 left-4 px-2 py-1 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 text-white text-xs font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Hot
          </div>
        )}
      </div>
      
      <div className="p-6 space-y-4">
        <h3 className="font-bold text-gray-900 text-lg leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {blog.title}
        </h3>
        
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {blog.summary}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{blog.readingTime}</span>
          </div>
          
          <button 
            className="flex items-center gap-1 hover:text-red-500 transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              handleLikeBlog(blog.id);
            }}
          >
            <ThumbsUp className="w-3 h-3" />
            <span>{blog.likes}</span>
          </button>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span className="truncate max-w-24">{blog.author}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{blog.publishDate}</span>
          </div>
        </div>
        
        {blog.source && (
          <div className="text-xs text-blue-600 font-medium">
            Nguồn: {blog.source}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Page className="py-3 min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="sticky top-10 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 mt-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
              Tin Tức & Blog
            </h1>
            <p className="text-gray-600 mt-1">Cập nhật những tin tức mới nhất từ thế giới công nghệ, kinh doanh và khoa học</p>
          </div>
          
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Tìm kiếm tin tức, công nghệ, kinh doanh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              clearable
            />
          </div>
          
          <Tabs activeKey={activeTab} onChange={setActiveTab} className="blog-tabs">
            <Tabs.Tab key="all" label="🌟 Tất cả" />
            <Tabs.Tab key="trending" label="🔥 Xu hướng" />
            <Tabs.Tab key="tech" label="💻 Công nghệ" />
            <Tabs.Tab key="business" label="💼 Kinh doanh" />
            <Tabs.Tab key="science" label="🔬 Khoa học" />
          </Tabs>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8 mb-8">
        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2 text-red-600">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              <span className="font-medium">Lỗi khi tải tin tức:</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
            <details className="mt-2">
              <summary className="cursor-pointer text-sm text-red-600">Chi tiết lỗi</summary>
              <div className="mt-2 text-xs bg-red-50 p-2 rounded">
                <p>API URL: {BASE_URL}</p>
                <p>Các nguyên nhân có thể:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>Server backend chưa chạy</li>
                  <li>URL ngrok đã thay đổi</li>
                  <li>Lỗi CORS configuration</li>
                  <li>API endpoint không tồn tại</li>
                  <li>NewsAPI quota exceeded</li>
                </ul>
              </div>
            </details>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading && blogs.length === 0 ? (
            Array.from({ length: 6 }, (_, index) => renderSkeletonCard(index))
          ) : blogs.length > 0 ? (
            blogs.map(renderBlogCard)
          ) : !loading && !error ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy bài viết</h3>
              <p className="text-gray-600 text-center max-w-md">
                {searchQuery ? 
                  "Không có bài viết nào phù hợp với từ khóa tìm kiếm của bạn. Hãy thử với từ khóa khác." :
                  "Hiện tại chưa có bài viết nào trong danh mục này."
                }
              </p>
            </div>
          ) : null}
        </div>
        
        {!loading && blogs.length > 0 && hasMore && (
          <div className="flex justify-center mt-12">
            <button 
              onClick={handleLoadMore}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang tải..." : "Xem thêm bài viết"}
            </button>
          </div>
        )}
      </div>
    </Page>
  );
};

export default BlogPage;