// src/pages/BlogPage.jsx
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

  const API_KEY = "474cc9de345a4e1ca713aaf4f1be01e5";
  const BASE_URL = "https://newsapi.org/v2/everything";

  const categoryEndpoints = {
    all: { endpoint: "everything", query: "technology OR business OR science" },
    tech: { endpoint: "everything", query: "technology OR AI OR software OR programming" },
    business: { endpoint: "top-headlines", category: "business" },
    science: { endpoint: "top-headlines", category: "science" },
    news: { endpoint: "top-headlines", category: "general" }
  };

  const techDomains = "techcrunch.com,theverge.com,wired.com,arstechnica.com,engadget.com";

  const fetchNewsData = async (category = "all", query = "") => {
    try {
      setLoading(true);
      setError(null);

      let url;
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 7);
      
      const formatDate = (date) => date.toISOString().split('T')[0];

      if (query) {
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&from=${formatDate(yesterday)}&to=${formatDate(today)}&sortBy=popularity&language=en&pageSize=20&apiKey=${API_KEY}`;
      } else {
        switch(category) {
          case "tech":
            url = `https://newsapi.org/v2/everything?q=technology OR programming OR AI OR software&domains=${techDomains}&from=${formatDate(yesterday)}&to=${formatDate(today)}&sortBy=popularity&language=en&pageSize=20&apiKey=${API_KEY}`;
            break;
          case "business":
            url = `https://newsapi.org/v2/top-headlines?category=business&country=us&pageSize=20&apiKey=${API_KEY}`;
            break;
          case "science":
            url = `https://newsapi.org/v2/top-headlines?category=science&country=us&pageSize=20&apiKey=${API_KEY}`;
            break;
          case "news":
            url = `https://newsapi.org/v2/top-headlines?category=general&country=us&pageSize=20&apiKey=${API_KEY}`;
            break;
          default:
            url = `https://newsapi.org/v2/everything?q=technology OR business OR science&from=${formatDate(yesterday)}&to=${formatDate(today)}&sortBy=popularity&language=en&pageSize=20&apiKey=${API_KEY}`;
        }
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== "ok") {
        throw new Error(data.message || "Failed to fetch news");
      }

      const transformedBlogs = data.articles
        .filter(article => article.title && article.description && article.urlToImage)
        .map((article, index) => ({
          id: index + 1,
          title: article.title,
          summary: article.description,
          coverImage: article.urlToImage,
          category: getCategoryFromContent(article.title + " " + article.description, article.source.name),
          author: article.author || article.source.name || "Unknown",
          publishDate: new Date(article.publishedAt).toLocaleDateString('vi-VN'),
          readingTime: estimateReadingTime(article.description),
          likes: Math.floor(Math.random() * 500) + 50,
          comments: Math.floor(Math.random() * 100) + 5,
          bookmarked: false,
          url: article.url,
          source: article.source.name
        }));

      setBlogs(transformedBlogs);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(err.message);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const estimateReadingTime = (text) => {
    const wordsPerMinute = 200;
    const wordCount = text.split(' ').length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} phút`;
  };

  const getCategoryFromContent = (content, source) => {
    const lowerContent = content.toLowerCase();
    const lowerSource = source.toLowerCase();
    
    const techSources = ['techcrunch', 'the verge', 'wired', 'ars technica', 'engadget', 'tech'];
    if (techSources.some(tech => lowerSource.includes(tech)) || 
        lowerContent.includes('technology') || lowerContent.includes('tech') || 
        lowerContent.includes('ai') || lowerContent.includes('software') || 
        lowerContent.includes('programming')) {
      return 'tech';
    }
    
    if (lowerContent.includes('business') || lowerContent.includes('market') || 
        lowerContent.includes('finance') || lowerContent.includes('economy') ||
        lowerSource.includes('business')) {
      return 'business';
    }
    
    if (lowerContent.includes('science') || lowerContent.includes('research') || 
        lowerContent.includes('study') || lowerContent.includes('discovery')) {
      return 'science';
    }
    
    return 'news';
  };

  useEffect(() => {
    fetchNewsData(activeTab, searchQuery);
  }, [activeTab]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchNewsData(activeTab, searchQuery);
      } else {
        fetchNewsData(activeTab);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleToggleBookmark = (blogId) => {
    setBlogs(
      blogs.map((blog) =>
        blog.id === blogId
          ? { ...blog, bookmarked: !blog.bookmarked }
          : blog
      )
    );
  };

  const handleLikeBlog = (blogId) => {
    setBlogs(
      blogs.map((blog) =>
        blog.id === blogId
          ? { ...blog, likes: blog.likes + 1 }
          : blog
      )
    );
  };

  const filteredBlogs = blogs.filter((blog) => {
    if (activeTab !== "all" && blog.category !== activeTab) {
      return false;
    }
    return true;
  });

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
    <div key={key} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
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
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={blog.coverImage} 
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x225/f3f4f6/6b7280?text=No+Image';
          }}
        />
        
        {/* Category Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 backdrop-blur-sm ${getCategoryColor(blog.category)}`}>
          {getCategoryIcon(blog.category)}
          {getCategoryName(blog.category)}
        </div>
        
        {/* Bookmark Button */}
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

        {/* Trending Badge */}
        {blog.likes > 300 && (
          <div className="absolute bottom-4 left-4 px-2 py-1 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 text-white text-xs font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Hot
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="font-bold text-gray-900 text-lg leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {blog.title}
        </h3>
        
        {/* Summary */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {blog.summary}
        </p>
        
        {/* Meta Info */}
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
        
        {/* Author & Date */}
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
        
        {/* Source */}
        {blog.source && (
          <div className="text-xs text-blue-600 font-medium">
            Nguồn: {blog.source}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Page className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200/50  mt-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
              Tin Tức & Blog
            </h1>
            <p className="text-gray-600 mt-1">Cập nhật những tin tức mới nhất từ thế giới công nghệ, kinh doanh và khoa học</p>
          </div>
          
          {/* Search Bar */}
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
          
          {/* Tabs */}
          <Tabs activeKey={activeTab} onChange={setActiveTab} className="blog-tabs">
            <Tabs.Tab key="all" label="🌟 Tất cả" />
            <Tabs.Tab key="tech" label="💻 Công nghệ" />
            <Tabs.Tab key="business" label="💼 Kinh doanh" />
            <Tabs.Tab key="science" label="🔬 Khoa học" />
            <Tabs.Tab key="news" label="📰 Tin tức" />
          </Tabs>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8  mb-8">
        {/* Error Message */}
        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2 text-red-600">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              <span className="font-medium">Lỗi khi tải tin tức:</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )}
        
        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 6 }, (_, index) => renderSkeletonCard(index))
          ) : filteredBlogs.length > 0 ? (
            filteredBlogs.map(renderBlogCard)
          ) : !error ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy bài viết</h3>
              <p className="text-gray-600 text-center max-w-md">
                Không có bài viết nào phù hợp với từ khóa tìm kiếm của bạn. Hãy thử với từ khóa khác.
              </p>
            </div>
          ) : null}
        </div>
        
        {/* Load More Button */}
        {!loading && filteredBlogs.length > 0 && (
          <div className="flex justify-center mt-12">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              Xem thêm bài viết
            </button>
          </div>
        )}
      </div>
    </Page>
  );
};

export default BlogPage;