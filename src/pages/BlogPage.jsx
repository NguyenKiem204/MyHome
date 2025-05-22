// src/pages/BlogPage.jsx
import React, { useState, useEffect } from "react";
import { Box, Page, Text, Input, Tabs } from "zmp-ui";
import { Search, Bookmark, Clock, ThumbsUp } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const BlogPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);

  const sampleBlogs = [
    {
      id: 1,
      title: "Hướng dẫn sử dụng tính năng mới trong ứng dụng",
      summary: "Tìm hiểu về các tính năng mới và cách sử dụng chúng một cách hiệu quả trong phiên bản cập nhật gần đây.",
      coverImage: "https://via.placeholder.com/300x200",
      category: "guide",
      author: "Admin",
      publishDate: "20/05/2025",
      readingTime: "5 phút",
      likes: 124,
      comments: 23,
      bookmarked: false,
    },
    {
      id: 2,
      title: "5 mẹo để tối ưu hóa trải nghiệm người dùng",
      summary: "Khám phá những cách đơn giản để nâng cao trải nghiệm và tận dụng tối đa khả năng của ứng dụng.",
      coverImage: "https://via.placeholder.com/300x200",
      category: "tips",
      author: "Chuyên gia UX",
      publishDate: "15/05/2025",
      readingTime: "8 phút",
      likes: 245,
      comments: 42,
      bookmarked: true,
    },
    {
      id: 3,
      title: "Cập nhật chính sách bảo mật - Những điều cần biết",
      summary: "Thông tin quan trọng về những thay đổi trong chính sách bảo mật và ảnh hưởng đến người dùng.",
      coverImage: "https://via.placeholder.com/300x200",
      category: "news",
      author: "Ban Quản Trị",
      publishDate: "10/05/2025",
      readingTime: "3 phút",
      likes: 98,
      comments: 15,
      bookmarked: false,
    },
    {
      id: 4,
      title: "Tương lai của công nghệ Z - Xu hướng và dự đoán",
      summary: "Phân tích các xu hướng công nghệ mới nhất và dự đoán về sự phát triển trong tương lai gần.",
      coverImage: "https://via.placeholder.com/300x200",
      category: "tech",
      author: "Chuyên gia Công nghệ",
      publishDate: "05/05/2025",
      readingTime: "10 phút",
      likes: 312,
      comments: 67,
      bookmarked: false,
    },
    {
      id: 5,
      title: "Cách xử lý các vấn đề thường gặp khi sử dụng ứng dụng",
      summary: "Hướng dẫn chi tiết giúp bạn khắc phục các lỗi và vấn đề thường gặp một cách nhanh chóng.",
      coverImage: "https://via.placeholder.com/300x200",
      category: "guide",
      author: "Đội hỗ trợ",
      publishDate: "01/05/2025",
      readingTime: "7 phút",
      likes: 178,
      comments: 34,
      bookmarked: true,
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setBlogs(sampleBlogs);
      setLoading(false);
    }, 1000);
  }, []);

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
    if (
      searchQuery &&
      !blog.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !blog.summary.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

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
        onClick={() => window.location.href = `/blogs/${blog.id}`}
      >
        <Box 
          className="blog-cover"
          style={{ backgroundImage: `url(${blog.coverImage})` }}
        >
          <Box className={`blog-category ${blog.category}`}>
            {blog.category === "guide" ? "Hướng dẫn" :
             blog.category === "tips" ? "Mẹo hay" :
             blog.category === "news" ? "Tin tức" : "Công nghệ"}
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
            <Text className="blog-author">{blog.author}</Text>
            <Text className="blog-date">{blog.publishDate}</Text>
          </Box>
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
            placeholder="Tìm kiếm bài viết..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            clearable
          />
        </Box>
        
        <Tabs activeKey={activeTab} onChange={setActiveTab} className="blog-tabs">
          <Tabs.Tab key="all" label="Tất cả" />
          <Tabs.Tab key="guide" label="Hướng dẫn" />
          <Tabs.Tab key="tips" label="Mẹo hay" />
          <Tabs.Tab key="news" label="Tin tức" />
          <Tabs.Tab key="tech" label="Công nghệ" />
        </Tabs>
      </Box>
      
      <Box className="blog-list">
        {loading
          ? Array.from({ length: 3 }, (_, index) => renderBlogItem(null, true, index))
          : filteredBlogs.length > 0
          ? filteredBlogs.map((blog) => renderBlogItem(blog))
          : (
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
