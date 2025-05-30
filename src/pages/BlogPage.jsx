// src/pages/BlogPage.jsx
import React, { useState, useEffect } from "react";
import { Box, Page, Text, Input, Tabs } from "zmp-ui";
import { Search, Bookmark, Clock, ThumbsUp, User, Calendar } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../css/blog.css";

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
        // Nếu user search, dùng everything endpoint
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&from=${formatDate(yesterday)}&to=${formatDate(today)}&sortBy=popularity&language=en&pageSize=20&apiKey=${API_KEY}`;
      } else {
        // Dùng strategy khác nhau cho từng category
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
          default: // "all"
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

      // Transform API data để phù hợp với component structure
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
          likes: Math.floor(Math.random() * 500) + 50, // Random likes for demo
          comments: Math.floor(Math.random() * 100) + 5, // Random comments for demo
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

  const renderBlogItem = (blog, isLoading = false, key) => {
    if (isLoading) {
      return (
        <Box key={key} className="blog-item blog-skeleton">
          <Skeleton height={200} />
          <Box className="blog-content">
            <Skeleton height={20} width="80%" />
            <Skeleton height={60} width="100%" />
            <Box className="blog-meta-skeleton">
              <Skeleton height={16} width="30%" />
              <Skeleton height={16} width="30%" />
            </Box>
          </Box>
        </Box>
      );
    }

    return (
      <Box 
        key={blog.id} 
        className="blog-item"
        onClick={() => handleBlogClick(blog)}
      >
        <Box 
          className="blog-cover"
          style={{ backgroundImage: `url(${blog.coverImage})` }}
        >
          <Box className={`blog-category ${blog.category}`}>
            {blog.category === "tech" ? "Công nghệ" :
             blog.category === "business" ? "Kinh doanh" :
             blog.category === "science" ? "Khoa học" : "Tin tức"}
          </Box>
          <Box 
            className="blog-bookmark-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleBookmark(blog.id);
            }}
          >
            <Bookmark 
              size={20} 
              fill={blog.bookmarked ? "#4F46E5" : "none"} 
              color={blog.bookmarked ? "#4F46E5" : "#6B7280"} 
            />
          </Box>
        </Box>
        
        <Box className="blog-content">
          <Text className="blog-title">{blog.title}</Text>
          <Text className="blog-summary">{blog.summary}</Text>
          
          <Box className="blog-meta">
            <Box className="blog-meta-item">
              <Clock size={14} />
              <Text>{blog.readingTime}</Text>
            </Box>
            <Box 
              className="blog-meta-item blog-like-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleLikeBlog(blog.id);
              }}
            >
              <ThumbsUp size={14} />
              <Text>{blog.likes}</Text>
            </Box>
          </Box>
          
          <Box className="blog-info">
            <Box className="blog-author-info">
              <User size={12} />
              <Text className="blog-author">{blog.author}</Text>
            </Box>
            <Box className="blog-date-info">
              <Calendar size={12} />
              <Text className="blog-date">{blog.publishDate}</Text>
            </Box>
          </Box>
          
          {blog.source && (
            <Box className="blog-source">
              <Text className="source-label">Nguồn: {blog.source}</Text>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Page className="blog-page">
      <Box className="blog-header">
        <Box className="search-box">
          <Search size={20} className="search-icon" />
          <Input
            className="search-input"
            placeholder="Tìm kiếm tin tức..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            clearable
          />
        </Box>
        
        <Tabs activeKey={activeTab} onChange={setActiveTab} className="blog-tabs">
          <Tabs.Tab key="all" label="Tất cả" />
          <Tabs.Tab key="tech" label="Công nghệ" />
          <Tabs.Tab key="business" label="Kinh doanh" />
          <Tabs.Tab key="science" label="Khoa học" />
          <Tabs.Tab key="news" label="Tin tức" />
        </Tabs>
      </Box>
      
      <Box className="blog-list">
        {error && (
          <Box className="error-message">
            <Text style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
              Lỗi khi tải tin tức: {error}
            </Text>
          </Box>
        )}
        
        {loading
          ? Array.from({ length: 5 }, (_, index) => renderBlogItem(null, true, index))
          : filteredBlogs.length > 0
          ? filteredBlogs.map((blog) => renderBlogItem(blog))
          : !error && (
            <Box className="empty-blogs">
              <Text>Không tìm thấy bài viết nào phù hợp</Text>
            </Box>
          )
        }
      </Box>
    </Page>
  );
};

export default BlogPage;